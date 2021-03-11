package jmnet.moka.web.push.sender;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.PushResponseMessage;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <pre>
 * 푸시 전송 추천기사 Sender
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : SenderS
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class SenderS extends AbstractPushSender {


    @Override
    public FcmMessage makePushMessage(Long pushItemSeq, int appSeq) {

        log.debug("추천기사 - 푸시 전송을 위한 작업 처리 : {}", pushItemSeq);
        return FcmMessage
                .builder()
                .build();

    }


    @Override
    protected Long findLastTokenSeq(Integer appSeq) {
        return 10000l;
    }

    @Override
    protected List<PushAppToken> findAllToken(String sendType, long contentSeq, int appSeq, long lastTokenSeq, int pageIdx) {return null;
    }

    @Override
    protected PushResponseMessage sendMessage(List<PushAppToken> pushTokens, FcmMessage pushMessage) {
        return null;
    }
}
