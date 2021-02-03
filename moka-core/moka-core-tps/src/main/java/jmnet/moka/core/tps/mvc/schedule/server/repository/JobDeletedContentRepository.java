package jmnet.moka.core.tps.mvc.schedule.server.repository;

import jmnet.moka.core.tps.mvc.schedule.server.entity.JobDeletedContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 삭제된 작업 Repository
 * 2021. 2. 2. 김정민
 *
 */
@Repository
public interface JobDeletedContentRepository extends JpaRepository<JobDeletedContent, Long>, JobDeletedContentRepositorySupport{
}
