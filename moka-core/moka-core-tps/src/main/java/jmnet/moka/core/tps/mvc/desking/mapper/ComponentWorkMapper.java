/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * msp-tps ComponentWorkMapper.java 2020. 7. 29. 오후 4:07:10 ssc
 */
package jmnet.moka.core.tps.mvc.desking.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;

/**
 * <pre>
 *
 * 2020. 7. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 7. 29. 오후 4:07:10
 */
public interface ComponentWorkMapper extends BaseMapper<ComponentWorkVO, DeskingWorkSearchDTO> {

    /**
     * 기존의 작업용 수동컴포넌트 삭제 및 import
     *
     * @param search
     */
    List<List<Object>> findAllComponentWork(DeskingWorkSearchDTO search);

    //    /**
    //     * <pre>
    //     * 페이지에서 수동컴포넌트인 것 모두 조회
    //     * </pre>
    //     *
    //     * @param param
    //     * @return
    //     */
    //    List<DeskingComponentWorkVO> findComponentsWorkAll(DeskingWorkSearchDTO search);

    /**
     * <pre>
     * 컴포넌트 조회
     * </pre>
     *
     * @param seq 컴포넌트work 순번
     * @return
     */
    ComponentWorkVO findComponentWorkBySeq(Long seq);



    //    List<EditionVO> findEditionAll(Long pageSeq);
}
