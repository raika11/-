package jmnet.moka.core.tps.mvc.skin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import jmnet.moka.core.tps.mvc.skin.entity.SkinRel;

public interface SkinRelRepository extends JpaRepository<SkinRel, Long>, SkinRelRepositorySupport {
    /**
     * 관련아이템 삭제
     * 
     * @param skinSeq 스킨순번
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM SkinRel r WHERE r.skin.skinSeq = :skinSeq")
    int deleteBySkinSeq(@Param("skinSeq") Long skinSeq);
}
