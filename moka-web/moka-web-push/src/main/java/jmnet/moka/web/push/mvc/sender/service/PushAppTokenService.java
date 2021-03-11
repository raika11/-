package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;

import java.util.List;
import java.util.Optional;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushAppTokenService {

    /**
     * 대상 토큰 중 가장 큰 토큰 일련번호 조회
     *
     * @param appSeq 토큰 ID
     * @return 가장 큰 토큰 일련번호
     */
    Optional<PushAppToken> findByAppSeq(Integer appSeq);

    /**
     * 대상 토큰 목록 조회
     *
     * @param lastTokenSeq
     * @return 토큰 정보
     */
    //List<PushAppToken> findAllToken(Integer appSeq, Integer pageIdx);
    List<PushAppToken> findByTokenSeq(Long lastTokenSeq);
}
