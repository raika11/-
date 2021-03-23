/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 패키지검색 DTO
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
@Alias("PackageSearchDTO")
public class PackageSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "시작일시 검색")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty(value = "종료일시 검색")
    @DTODateTimeFormat
    private Date endDt;

    @ApiModelProperty("카테고리")
    private String category = TpsConstants.SEARCH_TYPE_ALL;

    @ApiModelProperty("패키지유형")
    @Pattern(regexp = "^(all)|(T)|(I)|(S)$", message = "{tps.issue.error.pattern.div}")
    private String div = TpsConstants.SEARCH_TYPE_ALL;

    @ApiModelProperty("구독여부")
    @Pattern(regexp = "^(all)|(Y)|(N)$", message = "{tps.issue.error.pattern.scbYn}")
    private String scbYn = TpsConstants.SEARCH_TYPE_ALL;

    @ApiModelProperty("노출여부")
    private String usedYn = TpsConstants.SEARCH_TYPE_ALL;

    public PackageSearchDTO() {
        super.setUseTotal(MokaConstants.YES);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
