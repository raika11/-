/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import org.springframework.data.domain.Page;

/**
 * Description: 편집영역 서비스
 *
 * @author ssc
 * @since 2020-11-04
 */
public interface AreaService {
    Page<Area> findAllArea(AreaSearchDTO search);

    Optional<Area> findAreaBySeq(Long areaSeq);

    Area insertArea(Area area);

    Area updateArea(Area area);
}
