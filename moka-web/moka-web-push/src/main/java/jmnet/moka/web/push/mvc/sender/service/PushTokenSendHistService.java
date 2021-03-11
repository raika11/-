package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushTokenSendHist;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushTokenSendHistService {

    /**
     * 푸시토큰 전송이력 이력
     *
     * @param pushTokenSendHist 작업
     * @return 작업
     */
    PushTokenSendHist savePushTokenSendHist(PushTokenSendHist pushTokenSendHist);
}
