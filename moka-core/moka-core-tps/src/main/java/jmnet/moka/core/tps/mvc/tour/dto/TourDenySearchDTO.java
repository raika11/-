/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Description: 견학 휴일 검색 DTO
 *
 * @author ssc
 * @since 2021-01-20
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("견학 휴일 검색 DTO")
public class TourDenySearchDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("삭제여부")
    @Builder.Default
    private String delYn = MokaConstants.NO;

    @ApiModelProperty("반복여부")
    @Builder.Default
    private String denyRepeatYn = MokaConstants.YES;

    public TourDenySearchDTO() {
        this.delYn = MokaConstants.NO;
        this.denyRepeatYn = MokaConstants.YES;
    }
}
