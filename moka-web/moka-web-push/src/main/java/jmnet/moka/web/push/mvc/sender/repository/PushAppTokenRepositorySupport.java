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
     * 특정작업 존재여부 확인 - 앱 일련번호
     *
     * @param appSeq   검색조건
     * @return 작업
     */
    Optional<PushAppToken> findFirstByAppSeqOrderByTokenSeqDesc(Integer appSeq);

}