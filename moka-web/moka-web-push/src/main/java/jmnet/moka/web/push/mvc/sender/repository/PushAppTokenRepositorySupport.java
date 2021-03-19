package jmnet.moka.web.push.mvc.sender.repository;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
import org.springframework.stereotype.Repository;

/**
 * 작업 Repository 2021. 2. 18.
 */
@Repository
public interface PushAppTokenRepositorySupport {

    /**
     * 범위에 해당하는 토큰 목록 조회
     *
     * @param pushAppTokenSearch 검색조건
     * @return 작업
     */
    List<PushAppToken> findAllByAppScope(PushAppTokenSearchDTO pushAppTokenSearch);


    /**
     * 조회 대상의 토큰 총건수, 최대토큰일련번호, 최소토큰 일련번호 조회
     *
     * @param appSeq 앱 일련번호
     * @return
     */
    PushAppTokenStatus countAllByAppScope(Integer appSeq);


}
