package jmnet.moka.web.push.mvc.sender.repository;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 작업 Repository 2021. 2. 18.
 */
@Repository
public interface PushAppTokenRepository extends JpaRepository<PushAppToken, Integer>, PushAppTokenRepositorySupport {

    /**
     * 대상 토큰 목록 페이지 조회
     *
     * @param appSeq 검색조건
     * @return 작업
     */
    List<PushAppToken> findAllByAppSeq(Integer appSeq, Pageable pageable);

    /**
     * 처음 토큰 조회
     *
     * @param appSeq 검색조건
     * @return 작업
     */
    List<PushAppToken> findFirstByAppSeqOrderByTokenSeqAsc(Integer appSeq);

    /**
     * 마지막 토큰 조회
     *
     * @param appSeq 검색조건
     * @return 작업
     */
    List<PushAppToken> findFirstByAppSeqOrderByTokenSeqDesc(Integer appSeq);


    /**
     * 대상 토큰 목록 조회
     *
     * @param tokenSeq 검색조건
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
