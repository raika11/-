package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import org.springframework.data.domain.Page;

import java.util.Optional;

/**
 * 작업 Service
 * 2021. 1. 26. 김정민
 *
 */
public interface JobContentService {

    /**
     * 작업목록 조회
     *
     * @param search 작업 정보
     * @return 작업목록
     */
    Page<JobContent> findJobContentList(JobContentSearchDTO search);

    /**
     * 작업 상세정보 조회
     *
     * @param jobSeq 작업 번호
     * @return 작업
     */
    Optional<JobContent> findJobContentById(Long jobSeq);

    /**
     * 작업 등록
     *
     * @param jobContent 작업
     * @return 작업
     */
    JobContent insertJobContent(JobContent jobContent);

    /**
     * 작업 수정
     *
     * @param jobContent 작업
     * @return 작업
     */
    JobContent updateJobContent(JobContent jobContent);

    /**
     * 작업 삭제
     *
     * @param jobContent 작업
     * @return 없음
     */
    void deleteJobContent(JobDeletedContent jobDeletedContent, JobContent jobContent);

    /**
     * 등록가능한 데이터인지 체크한다.
     *
     * @param search 작업 정보
     * @return 중복여부
     */
    boolean isValidData(JobContentSearchDTO search);

}
