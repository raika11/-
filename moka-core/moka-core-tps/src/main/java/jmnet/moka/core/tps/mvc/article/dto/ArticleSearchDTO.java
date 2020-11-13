package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("ArticleSearchDTO")
public class ArticleSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 6774193298696439472L;

    /**
     * 매체
     */
    private String sourceCode;

    /**
     * 분류
     */
    private String masterCode;

    /**
     * 서비스 시작일자
     */
    @DTODateTimeFormat
    private Date startServiceDay;

    /**
     * 서비스 종료일자
     */
    @DTODateTimeFormat
    private Date endServiceDay;

    public ArticleSearchDTO() {
        super(ArticleBasicVO.class, "totalId,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.sourceCode = TpsConstants.SEARCH_TYPE_ALL;
        this.masterCode = TpsConstants.SEARCH_TYPE_ALL;
    }

    /**
     * 종료일자(프로시져용)
     *
     * @return 종료일자
     */
    public String getEndServiceDay() {
        if (this.endServiceDay != null) {
            return McpDate.dateStr(this.endServiceDay, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }

    /**
     * 시작일자(프로시져용)
     *
     * @return 시작일자
     */
    public String getStartServiceDay() {
        if (this.startServiceDay != null) {
            return McpDate.dateStr(this.startServiceDay, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }


}
