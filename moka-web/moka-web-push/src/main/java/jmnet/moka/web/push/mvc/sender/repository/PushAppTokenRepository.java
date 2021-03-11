package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 작업 Repository
 * 2021. 2. 18.
 *
 */
@Repository
public interface PushAppTokenRepository extends JpaRepository<PushAppToken, Integer>, PushAppTokenRepositorySupport {

    /**
     * 대상 토큰 목록 조회
     *
     * @param tokenSeq   검색조건
     * @param tokenSeq   검색조건
     * @return 작업
     */
    List<PushAppToken> findByTokenSeq(Long tokenSeq);
}