package jmnet.moka.web.schedule.mvc.gen.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;

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
     * 스케줄 일련번호로 상세 조회
     *
     * @return 스케줄 상세
     */
    Optional<GenContent> findJobContentBySeq(Long jobSeq);

    /**
     * 예약 작업 유형으로 스케줄 정보 조회
     *
     * @return 스케줄 정보
     */
    GenContent findJobContentByWorkType(String workType);
}
