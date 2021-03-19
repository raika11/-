package jmnet.moka.web.push.mvc.sender.service;


import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;

/**
 * 작업 Service 2021. 2. 18.
 */
public interface PushContentsProcService {

    /**
     * 푸시 컨텐츠 이력 등록
     *
     * @param pushContentsProc 작업
     * @return 작업
     */
    PushContentsProc savePushContentsProc(PushContentsProc pushContentsProc);
}
