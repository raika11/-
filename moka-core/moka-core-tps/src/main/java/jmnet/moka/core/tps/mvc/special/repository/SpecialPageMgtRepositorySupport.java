/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.repository;

import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import org.springframework.data.domain.Page;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 12. 5.
 */
public interface SpecialPageMgtRepositorySupport {
    /**
     * 디지털 스페셜 목록 조회
     * @param search    검색조건
     * @return          디지털 스페셜 목록
     */
    Page<SpecialPageMgt> findAllSpecialPageMgt(SpecialPageMgtSearchDTO search);
}
