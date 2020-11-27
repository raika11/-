package jmnet.moka.core.tps.mvc.desking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.Date;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingHistVO;
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
@Alias("DeskingHistSearchDTO")
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class DeskingHistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -2603971576163143861L;

    /**
     * 작업일자
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 작업자ID
     */
    private String regId;

    /**
     * 작업 컴포넌트 SEQ
     */
    @Min(value = 1, message = "{tps.deskinghist.error.min.componentSeq}")
    private Long componentSeq;

    /**
     * 데이타셋SEQ
     */
    private Long datasetSeq;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @Builder.Default
    private EditStatusCode status = EditStatusCode.SAVE;

    public DeskingHistSearchDTO() {
        super(DeskingHistVO.class, "regDt,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.status = EditStatusCode.SAVE;
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

    public String getStatusCode() {
        return this.status.getCode();
    }

}
