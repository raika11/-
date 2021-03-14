package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import org.springframework.data.domain.Page;
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
     * 대상 토큰 목록 페이지 조회
     *
     * @param appSeq   검색조건
     * @return 작업
     */
    Page<PushAppToken> findAllByAppSeq(Integer appSeq, Pageable pageable);

    /**
     * 대상 토큰 목록 조회
     *
     * @param tokenSeq   검색조건
     * @return 작업
     */
    List<PushAppToken> findByTokenSeq(Long tokenSeq);

    /**
     * 대상 토큰 목록 삭제
     *
     * @param tokenSeq 토큰 일련번호
     * @return 삭제여부
     */
    long deletePushAppTokenByTokenSeq(long tokenSeq);
}