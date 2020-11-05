/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.mapper.AreaMapper;
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
    private AreaMapper areaMapper;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Page<Area> findAllArea(AreaSearchDTO search) {
        return areaRepository.findAllByDomain_DomainIdAndParent_AreaSeq(search.getDomainId(), search.getParentAreaSeq(), search.getPageable());
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

    @Override
    public void deleteArea(Area area) {
        String domainId = area.getDomain()
                              .getDomainId();

        Long areaSeq = area.getAreaSeq();

        // 1. 하위노드삭제
        Map paramMap = new HashMap();
        paramMap.put("domainId", domainId);
        paramMap.put("areaSeq", areaSeq);

        List<Long> subNodes = areaMapper.findSubNodes(paramMap);
        for (Long deletePageSeq : subNodes) {
            deleteOneArea(deletePageSeq);
        }

        // 2. 삭제
        deleteOneArea(areaSeq);
    }

    @Override
    public Long checkAreaComp(Area area) throws Exception {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Long success = (long)0;
        paramMap.put("areaSeq", area.getAreaSeq());
        paramMap.put("success", success);   // 1: 성공, -1: 페이지에 없는 컴포넌트, -2: 컨테이너에 없는 컴포넌트
        areaMapper.checkAreaComp(paramMap);
        return (long) paramMap.get("success");
    }

    private void deleteOneArea(Long areaSeq) {
        findAreaBySeq(areaSeq).ifPresent(area -> {
            log.info("[DELETE AREA] domainId : {} areaSeq : {}", area.getDomain()
                                                                     .getDomainId(), area.getAreaSeq());

            // 삭제
            areaRepository.deleteById(area.getAreaSeq());
        });
    }
}
