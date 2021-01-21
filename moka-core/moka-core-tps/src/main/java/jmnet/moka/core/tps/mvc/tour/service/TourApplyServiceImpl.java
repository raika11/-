/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.tour.dto.TourApplySearchDTO;
import jmnet.moka.core.tps.mvc.tour.mapper.TourMapper;
import jmnet.moka.core.tps.mvc.tour.vo.TourApplyVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 견학신청 service impl
 *
 * @author ssc
 * @since 2021-01-21
 */
@Service
@Slf4j
public class TourApplyServiceImpl implements TourApplyService {
    @Autowired
    private TourMapper tourMapper;

    @Override
    public List<TourApplyVO> findAllTourApply(TourApplySearchDTO search) {
        return tourMapper.upuTbJoongangTourApplyListSel(search);
    }

    @Override
    public TourApplyVO findTourApply(Long tourSeq) {
        return tourMapper.upuTbJoongangTourApplyByseqSel(tourSeq);
    }
}
