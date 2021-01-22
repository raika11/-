/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.tps.mvc.tour.dto.TourDenySearchDTO;
import jmnet.moka.core.tps.mvc.tour.mapper.TourMapper;
import jmnet.moka.core.tps.mvc.tour.vo.TourDenyVO;
import jmnet.moka.core.tps.mvc.tour.vo.TourPossibleDenyVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-21
 */
@Service
@Slf4j
public class TourDenyServiceImpl implements TourDenyService {

    @Autowired
    private TourMapper tourMapper;

    @Override
    public List<TourDenyVO> findAllTourDeny(TourDenySearchDTO search) {
        return tourMapper.upuTbJoongangTourDenyListSel(search);
    }

    @Override
    public void insertTourDeny(TourDenyVO tourDenyVo) {
        tourMapper.upuTbJoongangTourDenyIns(tourDenyVo);
    }

    @Override
    public void updateTourDeny(TourDenyVO tourDenyVo) {
        tourMapper.upuTbJoongangTourDenyUpd(tourDenyVo);
    }

    @Override
    public void deleteTourDeny(Long denySeq) {
        tourMapper.upuTbJoongangTourDenyDel(denySeq);
    }

    @Override
    public List<TourPossibleDenyVO> findAllTourDenyByPossible() {
        return tourMapper.upuTbJoongangTourPossibleBysel();
    }

    @Override
    public List<TourDenyVO> findAllTourDenyMonth(String startYear, String startMonth) {
        Map<String, Object> params = new HashMap<>();
        params.put("startYear", startYear);
        params.put("startMonth", startMonth);
        return tourMapper.upuTbJoongangTourDenyBymonthSel(params);
    }
}
