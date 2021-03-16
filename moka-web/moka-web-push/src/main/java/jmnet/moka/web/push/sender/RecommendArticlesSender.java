package jmnet.moka.web.push.sender;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.push.mvc.sender.dto.PushContentSeqSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.service.PushAppTokenService;
import jmnet.moka.web.push.mvc.sender.service.PushTokenSendHistService;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.Notification;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 푸시 전송 추천기사 Sender
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : RecommendArticlesSender
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class RecommendArticlesSender extends AbstractPushSender {

    private final PushAppTokenService pushAppTokenService;

    @Autowired
    protected ModelMapper modelMapper;

    public RecommendArticlesSender(PushAppTokenService pushAppTokenService, PushTokenSendHistService pushTokenSendHistService) {
        this.pushAppTokenService = pushAppTokenService;
        this.pushTokenSendHistService = pushTokenSendHistService;
    }

    @Override
    public FcmMessage makePushMessage(PushContents pushContents, PushApp pushApp) {
        long contentSeq = pushContents.getContentSeq();
        log.debug("[FcmMessage makePushMessage] pushItemSeq=", contentSeq);

        PushContentSeqSearchDTO searchContentSeq = new PushContentSeqSearchDTO();

        String pushType = null;
        String title = null;
        String content = null;
        String pushImgUrl = null;
        try {
            title = pushContents.getTitle();
            content = pushContents.getContent();
            pushImgUrl = pushContents.getPushImgUrl();
        } catch (Exception e) {
            log.debug(e.toString());
        }

        if (pushApp.equals("iOS")) {
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setBody(content);
            notification.setContent_available("true");
            notification.setMutable_content("true");
            notification.setUrl("http://dn.joongdo.co.kr");
            notification.setKey3(153);
            notification.setImage_url(pushImgUrl);

            return FcmMessage
                    .builder()
                    .notification(notification)
                    .build();
        } else {
            Map<String, String> data = new HashMap<>();
            data.put("key1", title);
            data.put("key2", content);
            data.put("key3", "http://dn.joongdo.co.kr");
            data.put("img_name", pushImgUrl);

            return FcmMessage
                    .builder()
                    .data(data)
                    .build();
        }
    }

    @Override
    protected Long findFirstTokenSeq(Integer appSeq) {
        List<PushAppToken> appTokenList = pushAppTokenService.findByAppSeqAsc(appSeq);
        Long tokenSeq = 0L;

        tokenSeq = appTokenList
                .get(0)
                .getTokenSeq();

        return tokenSeq;
    }

    @Override
    protected Long findLastTokenSeq(Integer appSeq) {
        /**
         * TODO 2. 대상 토큰 중 가장 큰 토큰 일련번호 조회
         * - 페이징 처리에 사용
         */
        List<PushAppToken> appTokenList = pushAppTokenService.findByAppSeqDesc(appSeq);
        Long tokenSeq = 0L;

        tokenSeq = appTokenList
                .get(0)
                .getTokenSeq();

        return tokenSeq;
    }

    @Override
    protected List<PushAppToken> findAllToken(String pushType, long contentSeq, int appSeq, long lastTokenSeq, int pageIdx, int tokenCnt)
            throws Exception {
        log.debug("속보 - 푸시 전송을 위한 작업 처리 :findAllToken  {}", pageIdx);

        /**
         * TODO 3. 토큰 목록 조회
         */
        return pushAppTokenService.findPushAppToken(appSeq, PageRequest.of(pageIdx, tokenCnt));

        //int totalPages = pushAppTokenlist.getTotalPages();

        //List<PushAppTokenDTO> tokenDTOList = modelMapper.map(pushAppTokenlist, PushAppTokenDTO.TYPE);
        //List<PushAppToken> returnValue = pushAppTokenlist;

        /*String chkToken = "";
        for (int i = 0; i < tokenDTOList.size(); i++) {
            if (i == 0) {
                chkToken = tokenDTOList
                        .get(i)
                        .getTokenSeq()
                        .toString();
            } else {
                chkToken = chkToken + "," + tokenDTOList
                        .get(i)
                        .getTokenSeq();
            }
        }

        log.info("chkToken=" + chkToken);

        for (PushAppTokenDTO pushAppToken : tokenDTOList) {
            try {
                log.debug("[ 푸시 앱 토큰 전송 이력 등록 ]");
                PushTokenSendHistDTO pushTokenSendHistDTO = new PushTokenSendHistDTO();

                PushTokenSendHist pushTokenSendHist = modelMapper.map(pushTokenSendHistDTO, PushTokenSendHist.class);

                pushTokenSendHist.setContentSeq(contentSeq);
                pushTokenSendHist.setTokenSeq(pushAppToken.getTokenSeq());
                pushTokenSendHist.setAppSeq(pushAppToken
                        .getAppSeq()
                        .intValue());
                pushTokenSendHist.setSendYn("N");
                pushTokenSendHist.setRegDt(McpDate.now());

                insertPushTokenSendHist(pushTokenSendHist);
                log.debug("[SUCCESS TO INSERT PUSH TOKEN SEND HIST]");

            } catch (Exception e) {
                log.error("[FAIL TO INSERT PUSH TOKEN SEND HIST]", e);
                throw new Exception("푸시 앱 토큰 전송 이력이 등록 되지 않습니다.", e);
            }
            if (pageIdx > totalPages) {
                returnValue = Collections.emptyList();
            }
        }*/
        /*
        String tokens = pushAppTokenlist
                .stream()
                .map(pushAppToken -> String.valueOf(pushAppToken.getTokenSeq()))
                .reduce((result, tokenSeq) -> result + "," + String.valueOf(tokenSeq))
                .get();

        try {
            pushTokenSendHistService.insertPushTokenSendHistBatch(PushTokenBatchVO
                    .builder()
                    .appSeq(appSeq)
                    .contentsSeq(contentSeq)
                    .tokenSeqs(tokens)
                    .build());
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PUSH TOKEN SEND HIST]", e);
            throw new Exception("푸시 앱 토큰 전송 이력이 등록 되지 않습니다.", e);
        }

        return pushAppTokenlist;
         */
    }



}
