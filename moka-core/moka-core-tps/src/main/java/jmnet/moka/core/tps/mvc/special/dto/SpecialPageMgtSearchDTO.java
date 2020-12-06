/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.dto;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 12. 5.
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(callSuper = true)
public class SpecialPageMgtSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 페이지코드
     */
    private String pageCd;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public SpecialPageMgtSearchDTO() {
        this.setUseTotal(MokaConstants.YES);
        this.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        this.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
