/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import jmnet.moka.core.tps.mvc.tour.mapper.TourMapper;
import jmnet.moka.core.tps.mvc.tour.vo.TourSetupVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 견학설정 service impl
 *
 * @author ssc
 * @since 2021-01-21
 */
@Service
@Slf4j
public class TourSetupServiceImpl implements TourSetupService {

    @Autowired
    private TourMapper tourMapper;

    @Override
    public TourSetupVO findTourSetup() {
        return tourMapper.upuTbJoongangTourSetupSel();
    }

    @Override
    public void updateTourSetup(TourSetupVO tourSetupVo) {
        tourMapper.upuTbJoongangTourSetupUpd(tourSetupVo);
    }
}
