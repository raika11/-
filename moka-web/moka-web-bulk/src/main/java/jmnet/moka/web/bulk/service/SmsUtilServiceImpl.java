package jmnet.moka.web.bulk.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.bulk.config.MokaBulkConfiguration;
import jmnet.moka.web.bulk.util.BulkUtil;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.service
 * ClassName : SmsUtilServiceImpl
 * Created : 2021-01-13 013 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-13 013 오후 5:11
 */
@Service
@Slf4j
public class SmsUtilServiceImpl implements SmsUtilService {
    private final MokaBulkConfiguration bulkConfiguration;

    private Thread smsThread;

    private final Map<Date, String> messageList = new TreeMap<>(Collections.reverseOrder());
    private long lastSendDt = 0;
    private long pauseGap = 0;

    private final long SECOND = 1000;
    private final long MINUTE = 60 * SECOND;
    private final long HOUR = 60 * MINUTE;

    // GAP_TIME_COUNT : 이 횟수 만큼은 반복적으로 SMS 보내는 것을 허락한다.
    private final long GAP_TIME_COUNT = 3;
    // GAP_TIME_START : GAP_TIME_COUNT 번 반복적으로 SMS 을 보내고 최초 Waiting 시간
    // 이후 4배의 Gap 시간 만큼 Waiting 한다.
    private final long GAP_TIME_START = 30 * SECOND;
    // GAP_TIME_LIMIT : Waiting 시간
    private final long GAP_TIME_LIMIT = 30 * MINUTE ;    // 30분 뒤에

    // GAP_TIME_PAUSE : pause 명령이 들어올 경우 멈추는 범위
    @SuppressWarnings("FieldCanBeLocal")
    private final long GAP_TIME_PAUSE = HOUR;

    private long lastSendGap = - (GAP_TIME_START * GAP_TIME_COUNT);

    public SmsUtilServiceImpl( MokaBulkConfiguration bulkConfiguration) {
        this.bulkConfiguration = bulkConfiguration;
    }

    @SuppressWarnings("BusyWait")
    @Override
    public void sendSms(String message) {
        if( pauseGap > System.currentTimeMillis() ) {
            log.info("SMS Pause : {}", message );
            return;
        }

        messageList.put( new Date(), message);

        if( smsThread == null ) {
            smsThread = new Thread(() -> {
                while( !Thread.currentThread().isInterrupted() ) {
                    try {
                        final long currentTime = System.currentTimeMillis();
                        if(!messageList.isEmpty()) {
                            if( currentTime - lastSendDt > lastSendGap ){
                                String sendMessage = "";
                                for( Date date : messageList.keySet()) {
                                    sendMessage = sendMessage.concat(
                                            McpDate.dateStr(date, McpDate.TIME_FORMAT)
                                            .concat(" : ")
                                            .concat(messageList.get(date))).concat("\n");
                                    if( sendMessage.length() > 80 ) {
                                        sendMessage = sendMessage.substring(0, 70).concat(String.format(" … %d건",messageList.size()));
                                        break;
                                    }
                                }

                                if (lastSendGap <= 0) {
                                    lastSendGap = lastSendGap + GAP_TIME_START;
                                } else {
                                    lastSendGap = Math.min(lastSendGap * 4, GAP_TIME_LIMIT);
                                }

                                log.info("sendMessage/sendMessage : [{}] 초 뒤에 전송\n{}  ", lastSendGap / 1000, sendMessage );
                                sendErrorSMS( sendMessage );

                                lastSendDt = currentTime;
                                messageList.clear();
                            }
                        } else {
                            if( currentTime - lastSendDt > lastSendGap ){
                                if( lastSendGap < 0 ) {
                                    if (currentTime - lastSendDt > GAP_TIME_START)
                                        lastSendGap = -(GAP_TIME_START * GAP_TIME_COUNT);
                                }
                                else
                                    lastSendGap = - (GAP_TIME_START * GAP_TIME_COUNT);
                            }
                        }

                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
            smsThread.start();
        }
    }

    @Override
    public void pause() {
        pauseGap = System.currentTimeMillis() + GAP_TIME_PAUSE;
        lastSendGap = - (GAP_TIME_START * GAP_TIME_COUNT);
    }

    private void sendErrorSMS(String message) {
        final String envFile = bulkConfiguration.getSmsListEnvFile();
        try {
            if (McpString.isNullOrEmpty(envFile))
                return;

            XMLUtil xu = new XMLUtil();
            Document doc = xu.getDocument(ResourceMapper
                    .getResouerceResolver().getResource(envFile));

            if( !xu.getString( doc, "./SmsSendList/@sendYn", "N" ).equals("Y") )
                return;

            final String sendMsg = message + "\n로그 : https://joongang.co.kr/8nep";
            NodeList nl = xu.getNodeList(doc, "//User");
            for (int i = 0; i < nl.getLength(); i++) {
                if( !xu.getString(nl.item(i), "./@sendYn", "N" ).equals("Y")  )
                    continue;

                final String phoneNumber = xu.getString(nl.item(i), "./@phone", "" );
                if( McpString.isNullOrEmpty(phoneNumber))
                    continue;

                final String strSmsCall = "https://app.joins.com/SMS/?callback=02-2031-1805&phone=" + phoneNumber + "&ap=&uh=&msg=" + URLEncoder.encode(sendMsg,
                        StandardCharsets.UTF_8);
                if( BulkUtil.sendUrlGetRequest(strSmsCall) == null )
                    log.error("SMS failed {}", strSmsCall);
                else
                    log.info("SMS success {}", strSmsCall);
            }

        } catch (IOException | ParserConfigurationException | SAXException | XPathExpressionException ignored) {
        }
    }
}
