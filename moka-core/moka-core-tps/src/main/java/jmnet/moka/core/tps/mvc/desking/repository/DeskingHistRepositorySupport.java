/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.repository;

import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-27
 */
public interface DeskingHistRepositorySupport {

    Page<DeskingHist> findAllDeskingHist(DeskingHistSearchDTO search);
}
