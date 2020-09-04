package jmnet.moka.core.tps.mvc.desking.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingRelWork;
import javax.transaction.Transactional;

public interface DeskingRelWorkRepositorySupport {

    /**
     * 릴레이션 삭제
     * 
     * @param deskingRelWork 데스킹릴레이션워크
     */
    public void deleteByContentsIdAndrelContentsId(DeskingRelWork deskingRelWork);

}
