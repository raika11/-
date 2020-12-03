/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class CodeMgtGrpSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgtGrp.error.pattern.secretYn}")
    @Builder.Default
    private String secretYn = MokaConstants.NO;

    public CodeMgtGrpSearchDTO() {
        this.secretYn = MokaConstants.NO;
    }
}
