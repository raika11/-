package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenHist;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushAppTokenHistService {

    /**
     * 푸시 앱 토큰 이력
     *
     * @param pushAppTokenHist 작업
     * @return 작업
     */
    PushAppTokenHist savePushAppTokenHist(PushAppTokenHist pushAppTokenHist);
}
