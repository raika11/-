/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

/**
 * 데스킹 그룹바이 히스토리 검색객체
 *
 * @author jeon0525
 */
@Alias("IssueDeskingHistGroupSearchDTO")
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@ApiModel("이슈편집기사 히스토리 검색 DTO")
public class IssueDeskingHistGroupSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("패키지번호")
    @NotNull(message = "{tps.issue.error.notnull.pkgSeq}")
    private Long pkgSeq;

    @ApiModelProperty("컴포넌트 번호")
    @NotNull(message = "{tps.issue.error.notnull.compNo}")
    private Integer compNo;

    @ApiModelProperty("상태 - SAVE(임시) / PUBLISH(전송)")
    @Builder.Default
    private EditStatusCode status = EditStatusCode.SAVE;

    @ApiModelProperty("검색일자")
    @DTODateTimeFormat
    private Date searchDt;

    @ApiModelProperty("승인여부")
    private String approvalYn;

    public IssueDeskingHistGroupSearchDTO() {
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.status = EditStatusCode.SAVE;
        this.approvalYn = MokaConstants.NO;
    }

    /**
     * 작업시작일자(프로시져용)
     *
     * @return 작업시작일자
     */
    public String getStartSearchDt() {
        if (searchDt != null) {
            return McpDate.dateStr(searchDt, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }

    /**
     * 작업종료일자(프로시져용)
     *
     * @return 작업종료일자
     */
    public String getEndSearchDt() {
        if (searchDt != null) {
            Date endDate = McpDate.datePlus(searchDt, 1);  // 마지막날은 +1
            String endDateStr = McpDate.dateStr(endDate, MokaConstants.JSON_DATE_FORMAT);
            return endDateStr;
        }
        return null;
    }

    public String getStatusCode() {
        return this.status.getCode();
    }

}
