/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.relation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Pageable;

/**
 * 컨테이너,컴포넌트,템플릿,데이타셋,광고가 사용된 관련 페이지,컨테이너,본문 조회조건
 *
 * @author ssc
 * @since 2020. 4. 20. 오후 1:39:07
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@ApiModel("관련아이템 검색 DTO")
public class RelationSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -5762199095013181372L;

    @ApiModelProperty("리턴 될 관련유형 (TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋)")
    @Pattern(regexp = "^(PG)|(CT)|(CP)|(TP)|(AP)|(AD)|(TP)|(RS)$", message = "{tps.relation.error.pattern.relType}")
    private String relType;

    @ApiModelProperty("SEQ")
    @Min(value = 0, message = "{tps.relation.error.min.relSeq}")
    private Long relSeq;

    @ApiModelProperty("SEQ의 유형 (TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋)")
    @Pattern(regexp = "^(CT)|(CP)|(TP)|(AD)|(DS)|(DOMAIN)|()$", message = "{tps.common.error.invalid.relSeqType}")
    private String relSeqType;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private String domainId;

    @ApiModelProperty("파일저장여부")
    @Builder.Default
    private String fileYn = MokaConstants.NO;

    public RelationSearchDTO() {
        // 검색 조건의 기본값을 설정
        super("pageSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

    public Pageable getPageableAfterClearSort() {
        super.clearSort();
        return super.getPageable();
    }
}
