package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushApp;

import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 작업 Repository
 * 2021. 2. 18.
 *
 */
@Repository
public interface PushAppRepositorySupport {

    /**
     * 특정작업 존재여부 확인 - 앱 일련번호
     *
     * @param appSeq   검색조건
     * @return 작업
     */
    Optional<PushApp> findAllByAppSeq(Long appSeq);
}