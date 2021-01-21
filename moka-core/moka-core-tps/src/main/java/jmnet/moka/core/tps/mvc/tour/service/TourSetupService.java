/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import jmnet.moka.core.tps.mvc.tour.vo.TourSetupVO;

/**
 * Description: 견학설정 service
 *
 * @author ssc
 * @since 2021-01-21
 */
public interface TourSetupService {

    /**
     * 견학기본설정 조회
     *
     * @return 견학 기본설정
     */
    TourSetupVO findTourSetup();

    /**
     * 견학기본설정 수정
     *
     * @param tourSetupVo 견학기본설정
     */
    void updateTourSetup(TourSetupVO tourSetupVo);
}
