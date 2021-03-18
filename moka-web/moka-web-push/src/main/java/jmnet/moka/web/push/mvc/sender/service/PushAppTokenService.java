package jmnet.moka.web.push.mvc.sender.service;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
import org.springframework.data.domain.Pageable;

/**
 * 작업 Service 2021. 2. 18.
 */
public interface PushAppTokenService {

    /**
     * 토큰 목록 조회
     *
     * @param appSeq 앱 일련번호
     * @return 토큰 목록 조회 결과
     */
    List<PushAppToken> findPushAppToken(Integer appSeq, Pageable pageable);

    /**
     * 토큰 목록 조회
     *
     * @param appSeq 앱 일련번호
     * @return 토큰 목록 조회 결과
     */
    List<PushAppToken> findPushAppToken(Integer appSeq, long lastTokenSeq, Pageable pageable);

    /**
     * 토큰 목록 조회
     *
     * @param pushAppTokenSearch 검색조건
     * @return 토큰 목록 조회 결과
     */
    List<PushAppToken> findPushAppToken(PushAppTokenSearchDTO pushAppTokenSearch);

    /**
     * 토큰 건수, 최대일련번호, 최소일련번호 조회
     *
     * @param appSeq 앱 일련번호
     * @return 토큰 목록 조회 결과
     */
    PushAppTokenStatus findPushAppTokenStatus(Integer appSeq);

    /**
     * 토큰 목록 조회
     *
     * @param appSeq 앱 일련번호
     * @return 토큰 목록 조회 결과
     */
    List<PushAppToken> findPushAppToken(Integer appSeq, long start, long limit);

    /**
     * 최소 토큰 일련번호 조회
     *
     * @param appSeq 앱 일련번호
     * @return 토큰 일련번호
     */
    List<PushAppToken> findByAppSeqAsc(Integer appSeq);

    /**
     * 최대 토큰 일련번호 조회
     *
     * @param appSeq 앱 일련번호
     * @return 토큰 일련번호
     */
    List<PushAppToken> findByAppSeqDesc(Integer appSeq);

    /**
     * 대상 토큰 목록 조회
     *
     * @param lastTokenSeq
     * @return 토큰 정보
     */
    //List<PushAppToken> findAllToken(Integer appSeq, Integer pageIdx);
    List<PushAppToken> findByTokenSeq(Long lastTokenSeq);



    /**
     * 대상 토큰 목록 삭제
     *
     * @param pushTokenSeqs 토큰 목록 문자열
     */
    void deletePushAppToken(String pushTokenSeqs);
}
