package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.vo.JobStatisticVO;
import org.springframework.data.domain.Page;

public interface JobStatisticService {

    /**
     * 작업 통계정보를 조회한다.
     *
     * @param search 검색정보
     * @return 작업 통계목록
     */
    Page<JobStatisticVO> findAllJobStat(JobStatisticSearchDTO search);

    /**
     * 작업 현황정보를 조회한다.
     *
     * @param search 검색정보
     * @return 작업 현황목록
     */
    Page<JobStatistic> findJobStatisticList(JobStatisticSearchDTO search);
}
