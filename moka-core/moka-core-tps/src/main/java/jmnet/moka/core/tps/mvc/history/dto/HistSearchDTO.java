/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
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
@EqualsAndHashCode(callSuper = true)
@ApiModel("히스토리 검색조건 DTO")
public class HistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -6207554369251550982L;

    @ApiModelProperty("히스토리 일련번호")
    @Min(value = 1, message = "{tps.history.error.min.seq}")
    private Long seq;

    @ApiModelProperty("SEQ의 유형 (PG:페이지, AP: 기사페이지, TP:템플릿, CT:컨테이너)")
    @Pattern(regexp = "^(PG)|(AP)|(CT)|(TP)|()$", message = "{tps.history.error.pattern.seqType}")
    private String seqType;

    @ApiModelProperty("작업일자")
    @DTODateTimeFormat
    private Date regDt;

    public HistSearchDTO() {
        super("regDt,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

    /**
     * 작업시작일자(프로시져용)
     *
     * @return 작업시작일자
     */
    public String getStartRegDt() {
        if (regDt != null) {
            return McpDate.dateStr(regDt, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }

    /**
     * 작업종료일자(프로시져용)
     *
     * @return 작업종료일자
     */
    public String getEndRegDt() {
        if (regDt != null) {
            Date endDate = McpDate.datePlus(regDt, 1);  // 마지막날은 +1
            String endDateStr = McpDate.dateStr(endDate, MokaConstants.JSON_DATE_FORMAT);
            return endDateStr;
        }
        return null;
    }
}
