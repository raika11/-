package jmnet.moka.core.tps.mvc.bulklog.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;



/**
 * 벌크 모니터링 상세 리스트 검색
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class BulkLogTotalIdDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 기사ID
     */
    @ApiModelProperty(value = "기사ID", required = true)
    private String contentId;

    /**
     * 포털구분(기타코드BULK_SITE)
     */
    @ApiModelProperty(value = "포털구분(기타코드BULK_SITE) : NAVER_JA 또는 DAUM_JA .... ※ 상세 메시지 팝업 조회시 사용")
    private String portalDiv;

    public BulkLogTotalIdDTO() {
        super(BulkLogVO.class, "logSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
