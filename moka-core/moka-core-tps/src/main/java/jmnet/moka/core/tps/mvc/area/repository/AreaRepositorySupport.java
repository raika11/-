/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.area.entity.AreaSimple;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-11
 */
public interface AreaRepositorySupport {
    List<AreaSimple> findByParent(Long parentAreaSeq);
}
