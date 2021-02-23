/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.entity.AreaSimple;

/**
 * Description: 편집영역 QueryDSL
 *
 * @author ssc
 * @since 2020-11-11
 */
public interface AreaRepositorySupport {
    /**
     * 부모편집영역별 편집영역 목록 조회
     *
     * @param search 검색조건
     * @return 편집영역목록
     */
    List<AreaSimple> findByParent(AreaSearchDTO search);
}
