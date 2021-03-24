package jmnet.moka.web.push.mvc.sender.repository;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

/**
 * 작업 Repository 2021. 2. 18.
 */
@Repository
public interface PushContentsRepositorySupport {

    /**
     * 특정작업 존재여부 확인 - 관련 콘텐트 일련번호
     *
     * @param relContentId 검색조건
     * @return 작업
     */
    List<PushContents> findByRelContentId(Long relContentId);

    /**
     * 콘텐트 Seq 로 작업 목록 조회
     *
     * @param usedYn   검색조건
     * @param pageable
     * @return 작업 목록
     */
    Page<PushContents> findAllByUsedYn(String usedYn, Pageable pageable);

    /**
     * 특정작업 존재여부 확인 - 앱 일련번호
     *
     * @param contentSeq, pushYn   검색조건
     * @return 작업
     */
    Long countByContentSeqAndPushYn(Long contentSeq, String pushYn);
}