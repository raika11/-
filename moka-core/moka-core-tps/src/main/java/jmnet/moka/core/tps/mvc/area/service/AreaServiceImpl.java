/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.area.dto.AreaNode;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaSimple;
import jmnet.moka.core.tps.mvc.area.mapper.AreaMapper;
import jmnet.moka.core.tps.mvc.area.repository.AreaRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<AreaSimple> findAllArea(AreaSearchDTO search) {
        //        return areaRepository.findByParent_AreaSeqOrderByOrdNo(search.getParentAreaSeq());
        return areaRepository.findByParent(search.getParentAreaSeq());
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
    public Area updateArea(Area area)
            throws Exception {

        // 1. 기존 컴포넌트는 삭제 후, 저장
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Integer returnValue = TpsConstants.PROCEDURE_SUCCESS;
        paramMap.put("areaSeq", area.getAreaSeq());
        paramMap.put("returnValue", returnValue);
        areaMapper.deleteByAreaSeq(paramMap);
        if ((int) paramMap.get("returnValue") < 0) {
            log.debug("FAIL TO DELETE FAIL AREA COMPONENT : {} ", returnValue);
            throw new Exception("FAIL TO DELETE FAIL AREA COMPONENT: " + returnValue);
        }

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
    public Map<String, Object> checkAreaComp(Area area) {
        Map<String, Object> paramMap = new HashMap<String, Object>();
        Long byPage = (long) 1;
        Long byContainer = (long) 1;
        Long byContainerComp = (long) 1;
        paramMap.put("areaSeq", area.getAreaSeq());
        paramMap.put("byPage", byPage);                     // 1: 성공, -1: 페이지에 존재하지 않는 컴포넌트
        paramMap.put("byContainer", byContainer);           // 1: 성공, -1: 페이지에 존재하지 않는 컨테이너
        paramMap.put("byContainerComp", byContainerComp);   // 1: 성공, -1: 컨테이너에 존재하지 않는 컴포넌트
        areaMapper.checkAreaComp(paramMap);
        return paramMap;
    }

    @Override
    public AreaNode makeTree() {
        List<Area> areaList = areaRepository.findByUsedYn(MokaConstants.YES);
        return areaList.isEmpty() ? null : makeTree(areaList);
    }

    private AreaNode makeTree(List<Area> areaList) {
        AreaNode rootNode = new AreaNode();
        rootNode.setAreaSeq((long) 0);

        Iterator<Area> it = areaList.iterator();
        while (it.hasNext()) {
            Area area = it.next();

            if (area.getUsedYn()
                    .equals(MokaConstants.NO)) {
                continue;
            }

            if (area.getParent() == null || area.getParent()
                                                .getAreaSeq() == 0) {
                AreaNode areaNode = new AreaNode(area);
                rootNode.addNode(areaNode);
                //                rootNode.setMatch(getMatch(page, search) ? "Y" : "N");
            } else {
                AreaNode parentNode = rootNode.findNode(area.getParent()
                                                            .getAreaSeq(), rootNode);
                if (parentNode != null) {
                    AreaNode areaNode = new AreaNode(area);
                    //                    areaNode.setMatch(getMatch(page, search) ? "Y" : "N");
                    parentNode.addNode(areaNode);
                }
            }
        }
        rootNode.sort();
        return rootNode;
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
