package jmnet.moka.web.push.mvc.sender.repository;

import jmnet.moka.web.push.mvc.sender.entity.PushContentsProcPK;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 작업 Repository
 * 2021. 2. 18.
 *
@Repository
public interface PushContentsProcRepository extends CrudRepository<PushContentsProc, PushContentsProcPK>
        , JpaSpecificationExecutor<PushContentsProc>, PushContentsProcRepositorySupport {
    public List<PushContentsProc> findAllByContentSeq(PushContentsProcPK pushContentsProcPK);
}
 */
/**
public interface PushContentsProcRepository extends JpaRepository<PushContentsProc, PushContentsProcPK>, JpaSpecificationExecutor<PushContentsProc> {
    public List<PushContentsProc> findAllByContentSeq(PushContentsProcPK pushContentsProcPK);
}
 */
public interface PushContentsProcRepository
        extends JpaRepository<PushContentsProc, PushContentsProcPK>, JpaSpecificationExecutor<PushContentsProc> {

    //List<PushContentsProc> findAllByContentSeq(PushContentsProcPK pushContentsProcPK);
}