/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.desking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 컴포넌트 검색 DTO
 *
 * @author jeon
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("DeskingWorkSearchDTO")
public class DeskingWorkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -7998111385290877921L;

    /**
     * 편집영역SEQ
     */
    private Long areaSeq;

    /**
     * 작업자ID
     */
    private String regId;

    /**
     * 작업 컴포넌트 SEQ
     */
    private Long componentSeq;

    /**
     * 데이타셋SEQ
     */
    private Long datasetSeq;

    // 검색 조건의 기본값을 설정
    public DeskingWorkSearchDTO() {
        super(ComponentWorkVO.class, "componentOrd,asc");
        this.setUseTotal(MokaConstants.YES);
        this.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        this.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

}
