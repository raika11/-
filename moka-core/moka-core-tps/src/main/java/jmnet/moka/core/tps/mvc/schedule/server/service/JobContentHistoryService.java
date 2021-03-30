package jmnet.moka.core.tps.mvc.schedule.server.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentHistorySearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import org.springframework.data.domain.Page;

public interface JobContentHistoryService {

    /**
     * 작업예약 목록조회
     *
     * @param search 작업에약 정보
     * @return 작업목록
     */
    Page<JobContentHistory> findJobContentHistoryList(JobContentHistorySearchDTO search);

    /**
     * 작업예약 상세정보 조회
     *
     * @param seqNo 일련 번호
     * @return 작업
     */
    Optional<JobContentHistory> findJobContentHistoryById(Long seqNo);
}
