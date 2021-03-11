package jmnet.moka.web.push.support.httpclient;

import java.io.IOException;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.PushHttpResponse;

/**
 * FCM 전송 HttpClient interface
 */
public interface HttpPushClient {

    /**
     * 동기식 전송, 전송 완료때까지 waiting
     *
     * @param fcmMessage 푸시 메시지
     * @return 전송 결과
     * @throws Exception 예외 처리
     */
    PushHttpResponse push(PushAppToken pushToken, FcmMessage fcmMessage)
            throws Exception;

    /**
     * 비동기식 전송
     *
     * @param pushToken  푸시 토큰 정보
     * @param fcmMessage 푸시 메시지
     * @param nrl        전송 완료 Listener
     * @throws IOException 예외 처리
     */
    void push(PushAppToken pushToken, FcmMessage fcmMessage, PushHttpResponseListener nrl)
            throws IOException;
}
