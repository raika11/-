/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.repository.AreaRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-04
 */
@Service
@Slf4j
public class AreaServiceImpl implements AreaService {

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Page<Area> findAllArea(AreaSearchDTO search) {
        return areaRepository.findAllByDepth(search.getDepth(), search.getPageable());
    }

    @Override
    public Optional<Area> findAreaBySeq(Long areaSeq) {
        return areaRepository.findById(areaSeq);
    }

    @Override
    @Transactional
    public Area insertArea(Area area) {
        return areaRepository.save(area);
    }

    @Override
    public Area updateArea(Area area) {
        return areaRepository.save(area);
    }
}
