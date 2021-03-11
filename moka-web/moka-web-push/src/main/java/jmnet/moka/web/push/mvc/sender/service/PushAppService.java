package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;

import java.util.Optional;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushAppService {
    /**
     * 등록가능한 데이터인지 체크한다.
     *
     * @param search 작업 정보
     * @return 중복여부
     */
    Optional<PushApp> isValidData(PushAppSearchDTO search);


    /**
     * 대상 토큰 일련번호로 App 조회
     *
     * @param appSeq 토큰 ID
     * @return 가장 큰 토큰 일련번호
     */
    <PushApp> Optional<jmnet.moka.web.push.mvc.sender.entity.PushApp> findByAppSeq(Integer appSeq);
}
