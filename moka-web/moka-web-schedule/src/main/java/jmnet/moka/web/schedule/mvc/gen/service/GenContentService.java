package jmnet.moka.web.schedule.mvc.gen.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;

/**
 * <pre>
 * 스케줄 Service
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : JobContentService
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 12:00
 */
public interface GenContentService {

    /**
     * 사용가능한 스케줄 목록 조회
     *
     * @return 스케줄 목록
     */
    List<GenContent> findAllJobContent();

    /**
     * 사용가능한 반복성 스케쥴 목록 조회
     *
     * @return 스케줄 목록
     */
    List<GenContent> findAllScheduleJobContent();

    /**
     * 사용가능한 일회성 스케쥴 목록 조회
     *
     * @return 스케줄 목록
     */
    List<GenContent> findAllReservedJobContent();

    /**
     * 스케줄 일련번호로 상세 조회
     *
     * @return 스케줄 상세
     */
    Optional<GenContent> findJobContentBySeq(Long jobSeq);


    /**
     * 스케줄 일련번호로 최신 reserved 정보 조회
     *
     * @return 스케줄 상세
     */
    Optional<GenContentHistory> findGenContentHistory(Long jobSeq);

    /**
     * 예약이력 일련번호로 reserved 정보 조회
     *
     * @return 예약이력
     */
    Optional<GenContentHistory> findGenContentHistoryById(Long jobSeq);

    /**
     * 예약이력 jobTaskId로 reserved 정보 조회
     *
     * @return 예약이력
     */
    Optional<GenContentHistory> findGenContentHistoryByJobTaskId(String jobTaskId);

    /**
     * 예약이력 task id로 이력 정보 조회
     *
     * @return 예약이력
     */
    GenContentHistory insertGenContentHistory(GenContentHistory genStatusHistory);

    /**
     * 예약이력 task id로 이력 정보 조회
     *
     * @return 예약이력
     */
    long countGenContentHistoryByJobTaskId(String jobTaskId);


    /**
     * 예약실행을 시작한 reserved 정보 수정
     *
     * @return 예약이력
     */
    GenContentHistory updateGenContentHistory(GenContentHistory genStatusHistory);


    /**
     * 예약 작업 유형으로 스케줄 정보 조회
     *
     * @return 스케줄 정보
     */
    Optional<GenContent> findJobContentByJobCd(String workType);
}
