/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AreaRepository extends JpaRepository<Area, Long> {
    Page<Area> findAllByParent_AreaSeq(Long parentAreaSeq, Pageable pageable);

    List<Area> findByUsedYn(String usedYn);
}
