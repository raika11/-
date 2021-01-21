/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
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
 * Description: 견학신청 검색 DTO
 *
 * @author ssc
 * @since 2021-01-21
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("TourApplySearchDTO")
@ApiModel("견학신청 검색 DTO")
public class TourApplySearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("신청 시작일자")
    @DTODateTimeFormat
    private Date startTourDay;

    @ApiModelProperty("신청 종료일자")
    @DTODateTimeFormat
    private Date endTourDay;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public TourApplySearchDTO() {
        this.setUseTotal(MokaConstants.YES);
        this.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

    /**
     * 종료일자(프로시져용)
     *
     * @return 종료일자
     */
    public String getEndTourDay() {
        if (this.endTourDay != null) {
            return McpDate.dateStr(this.endTourDay, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }

    /**
     * 시작일자(프로시져용)
     *
     * @return 시작일자
     */
    public String getStartTourDay() {
        if (this.startTourDay != null) {
            return McpDate.dateStr(this.startTourDay, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }
}
