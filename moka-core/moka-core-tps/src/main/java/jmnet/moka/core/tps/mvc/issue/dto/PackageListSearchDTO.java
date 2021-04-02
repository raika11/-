/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 패키지기사검색 DTO
 *
 * @author ssc
 * @since 2021-03-22
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("PackageListSearchDTO")
public class PackageListSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("패키지순번")
    @NotNull(message = "{tps.issue.error.notnull.pkgSeq}")
    @Min(value = 0, message = "{tps.issue.error.min.pkgSeq}")
    private Long pkgSeq;

    public PackageListSearchDTO() {
        super.setUseTotal(MokaConstants.YES);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
