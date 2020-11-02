/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * 히스토리 검색조건
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 21. 오전 11:17:39
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class HistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -6207554369251550982L;

    /**
     * SEQ
     */
    @Min(value = 1, message = "{tps.history.error.min.seq}")
    private Long seq;

    /**
     * SEQ의 유형 (TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋)
     */
    @Pattern(regexp = "^(CT)|(CP)|(TP)|(AD)|(DS)|(DOMAIN)|()$", message = "{tps.history.error.pattern.seqType}")
    private String seqType;

    // 정렬 기본값을 설정
    public HistSearchDTO() {
        super("regDt,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
