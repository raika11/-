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
 * 벌크 모니터링 리스트 검색
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
    private String orgSourceCode;

    /**
     * 포털구분
     */
    @ApiModelProperty("포털구분(기타코드BULK_SITE)")
    private String portalDiv;

    /**
     * 전송 진행중인 목록 체크(진행+오류)
     */
    @ApiModelProperty("진행+오류만 보기(체크 Y)")
    private String status;

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

}
