package jmnet.moka.core.tps.mvc.bulklog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * 벌크 모니터링 로그
 */
@AllArgsConstructor
@NoArgsConstructor
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
    private String orgSourceCode;

    /**
     * 매체명
     */
    @ApiModelProperty("매체명")
    private String orgSourceName;

    /**
     * 콘텐트구분
     */
    @ApiModelProperty("콘텐트구분")
    private String contentDiv;

    /**
     * 상태(진행+오류)
     */
    @ApiModelProperty("상태(진행+오류)")
    private String status;

    @ApiModelProperty(value = "전송시작일시", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.startDt}")
    private String startDt;

    @ApiModelProperty(value = "전송종료일시", required = true)
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
