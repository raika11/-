package jmnet.moka.web.push.mvc.sender.service;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;

/**
 * 작업 Service 2021. 2. 18.
 */
public interface PushAppTokenService {

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
     * 대상 토큰 목록 삭제
     *
     * @param pushTokenSeqs 토큰 목록 문자열
     */
    void deletePushAppToken(String pushTokenSeqs);
}
