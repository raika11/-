package jmnet.moka.core.tps.mvc.bulklog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;


/**
 * 벌크 모니터링 상세 리스트 검색
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class BulkLogTotalDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "전송시작일자", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.startDt}")
    private String startDt;

    @ApiModelProperty(value = "전송종료일자", required = true)
    @DTODateTimeFormat
    @NotNull(message = "{tps.search-keyword-log.error.notnull.endDt}")
    private String endDt;

}
