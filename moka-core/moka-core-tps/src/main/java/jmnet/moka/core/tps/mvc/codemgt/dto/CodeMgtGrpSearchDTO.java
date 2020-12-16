/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@ApiModel("그룹코드 검색 DTO")
public class CodeMgtGrpSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("숨김여부(all:전체, N:숨김제외)")
    @Pattern(regexp = "[(all)|(N)]{1,3}$", message = "{tps.codeMgtGrp.error.pattern.search.secretYn}")
    @Builder.Default
    private String secretYn = MokaConstants.NO;

    public CodeMgtGrpSearchDTO() {
        this.secretYn = MokaConstants.NO;
    }
}
