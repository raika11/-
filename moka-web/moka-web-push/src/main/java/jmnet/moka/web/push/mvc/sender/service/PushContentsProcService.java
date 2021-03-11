package jmnet.moka.web.push.mvc.sender.service;


import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProcPK;

import java.util.List;
import java.util.Optional;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushContentsProcService {

    /**
     * 푸시 컨텐츠 이력 등록
     *
     * @param pushContentsProc 작업
     * @return 작업
     */
    PushContentsProc savePushContentsProc(PushContentsProc pushContentsProc);

    /**
     * 푸시 컨텐츠 이력 조회
     *
     * @param pushContentsProcPK 작업
     * @return 작업
     */
    Optional<PushContentsProc> findPushContentsProcById(PushContentsProcPK pushContentsProcPK);
}
