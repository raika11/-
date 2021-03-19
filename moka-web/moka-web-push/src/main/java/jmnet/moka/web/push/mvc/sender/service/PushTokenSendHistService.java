package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.vo.PushTokenBatchVO;

/**
 * 작업 Service 2021. 2. 18.
 */
public interface PushTokenSendHistService {

    /**
     * 푸시토큰 전송이력 등록
     *
     * @param pushTokenBatch 푸시토큰 전송이력 정보
     * @return 작업 결과
     */
    int insertPushTokenSendHistBatch(PushTokenBatchVO pushTokenBatch);

    /**
     * 푸시토큰 전송이력 수정
     *
     * @param pushTokenBatch 푸시토큰 전송이력 정보
     * @return 작업 결과
     */
    int updatePushTokenSendHistBatch(PushTokenBatchVO pushTokenBatch);
}
