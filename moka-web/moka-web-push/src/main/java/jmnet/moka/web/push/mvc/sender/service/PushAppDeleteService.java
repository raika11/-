package jmnet.moka.web.push.mvc.sender.service;

/**
 * 작업 Service
 * 2021. 2. 18.
 *
 */
public interface PushAppDeleteService {
    /**
     * 요청한 취소 정보가 취소 가능한 작업인지 체크한다.
     *
     * @param contentSeq 작업 정보
     * @return 중복여부
     */
    Long countByContentSeq(Long contentSeq);
}
