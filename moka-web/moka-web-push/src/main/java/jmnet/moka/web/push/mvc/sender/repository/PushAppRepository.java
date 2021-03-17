package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 작업 Repository 2021. 2. 18.
 */
@Repository
public interface PushAppRepository extends JpaRepository<PushApp, Long>, PushAppRepositorySupport {

}
