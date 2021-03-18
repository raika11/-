package jmnet.moka.web.push.sender;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushContentSeqSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
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
 * 푸시 전송 뉴스룸레터 Sender
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
public class NewsRoomLetterSender extends AbstractPushSender {

    private final PushAppTokenService pushAppTokenService;

    @Autowired
    protected ModelMapper modelMapper;

    public NewsRoomLetterSender(PushAppTokenService pushAppTokenService, PushTokenSendHistService pushTokenSendHistService) {
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
    protected PushAppTokenStatus findAppTokenStatus(Integer appSeq, Long contentSeq) {
        return null;
    }


    @Override
    protected List<PushAppToken> findAllToken(String pushType, long contentSeq, int appSeq, long lastTokenSeq, int pageIdx, int tokenCnt)
            throws Exception {
        log.debug("NewsRoomLetterSender :findAllToken  {}", pageIdx);

        /** 토큰 목록 조회 */
        return pushAppTokenService.findPushAppToken(appSeq, PageRequest.of(pageIdx, tokenCnt));
    }

    @Override
    protected List<PushAppToken> findAllToken(PushAppTokenSearchDTO pushAppTokenSearch)
            throws Exception {
        return null;
    }
}
