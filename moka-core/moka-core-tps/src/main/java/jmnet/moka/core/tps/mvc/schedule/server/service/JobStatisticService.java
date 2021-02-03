package jmnet.moka.core.tps.mvc.schedule.server.service;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.vo.JobStatisticVO;
import org.springframework.data.domain.Page;

public interface JobStatisticService {
    Page<JobStatisticVO> findAllJobStat(JobContentSearchDTO searchDTO);

    Page<JobStatistic> findJobStatisticList(JobStatisticSearchDTO search);
}
