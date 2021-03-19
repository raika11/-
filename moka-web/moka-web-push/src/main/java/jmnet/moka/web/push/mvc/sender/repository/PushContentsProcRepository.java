package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProcPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 작업 Repository 2021. 2. 18.
 *
 * @Repository
 */
public interface PushContentsProcRepository extends JpaRepository<PushContentsProc, PushContentsProcPK>, JpaSpecificationExecutor<PushContentsProc> {
}