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
 * <pre>
 *
 * 2020. 7. 8. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 7. 8. 오후 12:34:59
 */
public interface AreaMapper extends BaseMapper<AreaDTO, AreaSearchDTO> {
    List<Long> findSubNodes(Map<String, Object> map);
}
