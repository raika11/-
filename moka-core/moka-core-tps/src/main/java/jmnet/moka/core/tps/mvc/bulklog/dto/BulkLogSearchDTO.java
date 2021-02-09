package jmnet.moka.core.tps.mvc.bulklog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


/**
 * 벌크 모니터링 로그
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class BulkLogSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 매체코드
     */
    @ApiModelProperty("매체코드")
    private String sourceCode;

    public BulkLogSearchDTO() {
        super(BulkLogVO.class, "totalId,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

    @ApiModelProperty(value = "전송시작일자", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.startDt}")
    private String startDt;

    @ApiModelProperty(value = "전송종료일자", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.endDt}")
    private String endDt;

    /**
     * 종료일자(프로시져용)
     *
     * @return 종료일자
    public String getEndDt() {
        if (this.endDt != null) {
            return McpDate.dateStr(this.endDt, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }
     */

    /**
     * 시작일자(프로시져용)
     *
     * @return 시작일자
    public String getStartDt() {
        if (this.startDt != null) {
            return McpDate.dateStr(this.startDt, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }
     */

}
