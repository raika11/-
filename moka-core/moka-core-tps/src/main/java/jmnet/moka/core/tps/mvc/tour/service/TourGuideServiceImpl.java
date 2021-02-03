/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import java.util.List;
import javax.transaction.Transactional;
import jmnet.moka.core.tps.mvc.tour.mapper.TourMapper;
import jmnet.moka.core.tps.mvc.tour.vo.TourGuideVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-20
 */
@Service
@Slf4j
public class TourGuideServiceImpl implements TourGuideService {

    @Autowired
    private TourMapper tourMapper;

    @Override
    public List<TourGuideVO> findAllTourGuide() {
        return tourMapper.findAllTourGuide();
    }

    /**
     * 프로시져 에러 여부 확인
     *
     * @param ret 프로시져 리턴값
     * @return 에러가 있으면 true, 없으면 false
     */
    private boolean isReturnErr(Integer ret) {
        if (ret == null) {
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean saveTourGuide(List<TourGuideVO> guideVOList) {
        for (TourGuideVO vo : guideVOList) {
            if (isReturnErr(tourMapper.updateTourGuide(vo))) {
                return false;
            }
        }
        return true;
    }
}
