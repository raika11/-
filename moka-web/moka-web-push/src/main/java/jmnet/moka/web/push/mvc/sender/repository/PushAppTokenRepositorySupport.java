package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 작업 Repository
 * 2021. 2. 18.
 *
 */
@Repository
public interface PushAppTokenRepositorySupport {

    /**
     * 처음 토큰 조회
     *
     * @param appSeq   검색조건
     * @return 작업
     */
    List<PushAppToken> findFirstByAppSeqOrderByTokenSeqAsc(Integer appSeq);

    /**
     * 마지막 토큰 조회
     *
     * @param appSeq   검색조건
     * @return 작업
     */
    List<PushAppToken> findFirstByAppSeqOrderByTokenSeqDesc(Integer appSeq);
}