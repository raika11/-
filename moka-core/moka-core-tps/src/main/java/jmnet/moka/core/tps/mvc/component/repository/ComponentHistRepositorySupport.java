/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.component.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-19
 */
public interface ComponentHistRepositorySupport {
    List<ComponentHist> findLastHist(Long componentSeq, String dataType);
}
