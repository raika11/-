/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import jmnet.moka.core.tps.mvc.area.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaRepository extends JpaRepository<Area, Long>, AreaRepositorySupport {
    // 하위 엔티티의 정보도 같이 left outer join으로 가져올 경우, 쿼리가 한번만 돌도록 EntityGraph를 사용한다.
    // QueryDSL의 Projections을 사용할 경우, 엔티티의 엔티티의 엔티티의 join낭비를 막을 수 있다.
    //    @EntityGraph(attributePaths = {"domain", "page.domain", "parent", "container.domain", "areaComps.component", "areaComps.component.dataset",
    //            "areaComps.component.template"})
    //    List<Area> findByParent_AreaSeq(Long parentAreaSeq, Pageable pageable);
    //    List<AreaSimple> findByParent_AreaSeqOrderByOrdNo(Long parentAreaSeq);

}
