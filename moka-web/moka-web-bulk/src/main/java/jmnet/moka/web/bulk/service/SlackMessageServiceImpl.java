package jmnet.moka.web.bulk.service;

import java.util.Date;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.slack.SlackChannel;
import jmnet.moka.core.common.slack.SlackHelper;
import jmnet.moka.web.bulk.service.vo.SlackMessageVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
public class SlackMessageServiceImpl implements SlackMessageService {
    final SlackHelper slackHelper;

    @SuppressWarnings("FieldCanBeLocal")
    private final ThreadPoolExecutor executor;
    private final LinkedBlockingDeque<SlackMessageVo> messageList = new LinkedBlockingDeque<>();

    private long lastSendDt = 0;
    private long pauseGap = 0;

    @Value("${bulk.slack.timer.firstlimitcount}")
    private long GAP_TIME_COUNT;

    @Value("#{timeHumanizer.parse('${bulk.slack.timer.waitingtime}', 30*1000)}")
    private long GAP_TIME_START;

    @Value("#{timeHumanizer.parse('${bulk.slack.timer.limitwaitingtime}', 30*1000*1000)}")
    private long GAP_TIME_LIMIT;

    @Value("#{timeHumanizer.parse('${bulk.slack.timer.pausetime}', 60*1000*1000)}")
    private long GAP_TIME_PAUSE;

    @Value("${bulk.slack.channelname}")
    private String channelName;

    private long lastSendGap = - (GAP_TIME_START * GAP_TIME_COUNT);

    @SuppressWarnings("BusyWait")
    public SlackMessageServiceImpl(SlackHelper slackHelper) {
        this.slackHelper = slackHelper;

        final int threadCount = 1;
        this.executor = new ThreadPoolExecutor( threadCount, threadCount, 100, TimeUnit.MILLISECONDS, new LinkedBlockingDeque<>(threadCount),
                (r, executor) -> log.info("SlackMessageService Thread pool is full {}", executor.getQueue().size() ) );

        for( int i=0 ; i<threadCount ; i++) {
            this.executor.execute(() -> {
                while( !Thread.currentThread().isInterrupted() ) {
                    try {
                        final long currentTime = System.currentTimeMillis();
                        if(!messageList.isEmpty()) {
                            if( currentTime - lastSendDt > lastSendGap ){

                                String title = "";
                                String sendMessage = "";
                                Object[] objList = messageList.toArray();
                                int count = 0;
                                for( Object obj : objList ) {
                                    SlackMessageVo message = (SlackMessageVo) obj;
                                    if(McpString.isNullOrEmpty(title))
                                        title = message.getTitle() + "...";

                                    count++;
                                    sendMessage = sendMessage.concat(
                                            McpDate.dateStr(message.getDate(), McpDate.TIME_FORMAT)
                                                   .concat(" : ")
                                                   .concat(message.getMessage())).concat("\n");
                                    if( count > 10 ) {
                                        sendMessage = sendMessage.concat(String.format(" … %d건",messageList.size()));
                                        break;
                                    }
                                }
                                messageList.clear();

                                if (lastSendGap <= 0) {
                                    lastSendGap = lastSendGap + GAP_TIME_START;
                                } else {
                                    lastSendGap = Math.min(lastSendGap * 4, GAP_TIME_LIMIT);
                                }

                                log.info("sendMessage/sendMessage : [{}] 초 뒤에 전송\n{}  ", lastSendGap / 1000, sendMessage );

                                slackHelper.sendMessage(SlackChannel.valueOf(this.channelName), sendMessage, title);

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
        }
    }

    @Override
    public void sendSms(String title, String message) {
        if( pauseGap > System.currentTimeMillis() ) {
            log.info("SMS Pause : {}", message );
            return;
        }
        messageList.addFirst( new SlackMessageVo(new Date(), title, message));
    }

    @Override
    public void pause() {
        pauseGap = System.currentTimeMillis() + GAP_TIME_PAUSE;
        lastSendGap = - (GAP_TIME_START * GAP_TIME_COUNT);
    }
}
