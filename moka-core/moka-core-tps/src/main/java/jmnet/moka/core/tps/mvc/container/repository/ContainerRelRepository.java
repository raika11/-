package jmnet.moka.core.tps.mvc.container.repository;

import jmnet.moka.core.tps.mvc.container.entity.ContainerRel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 컨테이너 레포지토리
 *
 * @author ohtah
 */
@Repository
public interface ContainerRelRepository extends JpaRepository<ContainerRel, Long>, ContainerRelRepositorySupport {

    /**
     * 관련아이템 삭제
     *
     * @param containerSeq 컨테이너순번
     */
    //    @Transactional
    //    @Modifying
    //    @Query("DELETE FROM ContainerRel r WHERE r.container.containerSeq = :containerSeq")
    //    int deleteByContainerSeq(@Param("containerSeq") Long containerSeq);

}
