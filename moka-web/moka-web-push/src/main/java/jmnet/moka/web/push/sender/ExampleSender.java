package jmnet.moka.web.push.sender;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 푸시 전송 테스트용 Sender
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : ExampleSender
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class ExampleSender extends AbstractPushSender {


    @Override
    public FcmMessage makePushMessage(Long pushItemSeq) {

        log.debug("푸시 전송을 위한 작업 처리 : {}", pushItemSeq);

        return FcmMessage
                .builder()
                .build();

    }


    @Override
    protected Long findLastTokenSeq(Integer appSeq) {
        return 10000l;
    }

    @Override
    protected List<PushAppToken> findAllToken(int pageIdx) {
        return null;
    }


}
