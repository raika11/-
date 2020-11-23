/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.area.dto.AreaDTO;
import jmnet.moka.core.tps.mvc.area.dto.AreaNode;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;
import jmnet.moka.core.tps.mvc.area.entity.Area;
import jmnet.moka.core.tps.mvc.area.entity.AreaSimple;

/**
 * Description: 편집영역 서비스
 *
 * @author ssc
 * @since 2020-11-04
 */
public interface AreaService {

    /**
     * 편집영역을 부모편집영역기준으로 조회
     *
     * @param search 검색조건
     * @return 편집영역목록
     */
    List<AreaSimple> findAllArea(AreaSearchDTO search);

    /**
     * 편집영역조회(편집영역컴포넌트 포함)
     *
     * @param areaSeq 편집영역SEQ
     * @return 편집영역
     */
    Optional<Area> findAreaBySeq(Long areaSeq);

    /**
     * 편집영역등록(편집영역컴포넌트 포함)
     *
     * @param area 편집영역
     * @return 등록된 편집영역
     */
    Area insertArea(Area area);

    /**
     * 편집영역수정(편집영역컴포넌트 포함)
     *
     * @param area 편집영역
     * @return 수정된 편집영역
     */
    Area updateArea(Area area)
            throws Exception;

    /**
     * 편집영역삭제(편집영역컴포넌트 포함). 하위편집영역도 삭제됨
     *
     * @param area 삭제할 편집영역
     */
    void deleteArea(Area area);

    /**
     * 편집영역 컴포넌트가 페이지에 존재하는지 조사한다.
     *
     * @param area 편집영역
     * @return
     * @throws Exception
     */
    Map<String, Object> checkAreaComp(Area area)
            throws Exception;

    /**
     * 편집영역 목록 조회(트리용)
     *
     * @return
     */
    AreaNode makeTree();

    /**
     * 컴포넌트타입일 경우, areaComps-> areaComp로 컴포넌트 정보 이동
     *
     * @param areaDTO
     * @return
     */
    AreaDTO compsToComp(AreaDTO areaDTO);

    /**
     * 컴포넌트타입일 경우, areaComp-> areaComps로 컴포넌트 정보 이동
     *
     * @param areaDTO
     * @return
     */
    AreaDTO compToComps(AreaDTO areaDTO);
}
