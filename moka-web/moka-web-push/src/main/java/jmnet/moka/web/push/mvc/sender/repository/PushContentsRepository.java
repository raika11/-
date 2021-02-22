package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 작업 Repository
 * 2021. 2. 18.
 *
 */
@Repository
public interface PushContentsRepository extends JpaRepository<PushContents, Long>, PushContentsRepositorySupport {

}