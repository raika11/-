package jmnet.moka.web.push.sender;

import jmnet.moka.web.push.mvc.sender.entity.MobPushToken;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <pre>
 * 푸시 전송 뉴스룸레터 Sender
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : SenderN
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class SenderN extends AbstractPushSender {


    @Override
    public FcmMessage makePushMessage(Long pushItemSeq) {

        log.debug("뉴스룸레터 - 푸시 전송을 위한 작업 처리 : {}", pushItemSeq);

        /**
         * TODO 1. 업무별 푸시 메시지 생성 로직 구현
         */
        return FcmMessage
                .builder()
                .build();

    }


    @Override
    protected Long findLastTokenSeq(Integer appSeq) {
        /**
         * TODO 2. 대상 토큰 중 가장 큰 토큰 일련번호 조회
         * - 페이징 처리에 사용
         */
        return 10000l;
    }

    @Override
    protected List<MobPushToken> findAllToken(int pageIdx) {
        /**
         * TODO 3. 토큰 목록 조회
         */
        return null;
    }


}
