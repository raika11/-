package jmnet.moka.web.push.mvc.sender.repository;

import org.springframework.stereotype.Repository;

/**
 * 작업 Repository
 * 2021. 2. 18.
 *
 */
@Repository
public interface PushAppDeleteRepositorySupport {

    /**
     * 특정작업 존재여부 확인 - 앱 일련번호
     *
     * @param contentSeq   검색조건
     * @return 작업
     */
    Long countByContentSeq(Long contentSeq);
}