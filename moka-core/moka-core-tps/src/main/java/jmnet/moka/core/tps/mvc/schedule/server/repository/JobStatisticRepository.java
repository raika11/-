package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 작업 실행상태 Repository
 * 2021. 2. 3. 김정민
 *
 */
public interface JobStatisticRepository extends JpaRepository<JobStatistic, Long>, JobStatisticRepositorySupport{
}
