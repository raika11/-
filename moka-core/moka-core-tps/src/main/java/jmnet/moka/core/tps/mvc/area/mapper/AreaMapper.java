/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

/**
 * msp-tps PageMapper.java 2020. 7. 8. 오후 12:34:59 ssc
 */
package jmnet.moka.core.tps.mvc.area.mapper;

import java.util.List;
import java.util.Map;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.area.dto.AreaDTO;
import jmnet.moka.core.tps.mvc.area.dto.AreaSearchDTO;

/**
 * 편집영역 Mapper
 *
 * @author ssc
 * @since 2020. 7. 8. 오후 12:34:59
 */
public interface AreaMapper extends BaseMapper<AreaDTO, AreaSearchDTO> {

    /**
     * 하위 편집영역목록 조회
     * @param map
     * @return
     */
    List<Long> findSubNodes(Map<String, Object> map);

    /**
     * 편집영역컴포넌트가 페이지내에 존재하는 지 체크
     * @param map
     */
    void checkAreaComp(Map<String, Object> map);
}
