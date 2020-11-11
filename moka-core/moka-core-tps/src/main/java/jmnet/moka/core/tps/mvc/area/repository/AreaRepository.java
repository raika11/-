/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaRepository extends JpaRepository<Area, Long>, AreaRepositorySupport {
    //    @EntityGraph(attributePaths = {"domain", "page.domain", "parent", "container.domain", "areaComps.component", "areaComps.component.dataset",
    //            "areaComps.component.template"})
    //    List<Area> findByParent_AreaSeq(Long parentAreaSeq, Pageable pageable);
    //    List<AreaSimple> findByParent_AreaSeqOrderByOrdNo(Long parentAreaSeq);

    List<Area> findByUsedYn(String usedYn);
}
