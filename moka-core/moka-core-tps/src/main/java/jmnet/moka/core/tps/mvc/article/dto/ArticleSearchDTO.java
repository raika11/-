package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
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
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("ArticleSearchDTO")
@ApiModel("기사 검색 DTO")
public class ArticleSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 6774193298696439472L;

    @ApiModelProperty("분류")
    @Length(max = 8, message = "{tps.article.error.length.masterCode}")
    private String masterCode;

    @ApiModelProperty("판")
    @Pattern(regexp = "[0-9]*$", message = "{tps.article.error.pattern.pressPan}")
    private String pressPan;

    @ApiModelProperty("면")
    @Pattern(regexp = "[0-9]*$", message = "{tps.article.error.pattern.pressMyun}")
    private String pressMyun;

    @ApiModelProperty("서비스 시작일자(필수)")
    @NotNull(message = "{tps.article.error.notnull.startServiceDay}")
    @DTODateTimeFormat
    private Date startServiceDay;

    @ApiModelProperty("서비스 종료일자(필수)")
    @NotNull(message = "{tps.article.error.notnull.endServiceDay}")
    @DTODateTimeFormat
    private Date endServiceDay;

    @ApiModelProperty("콘텐트타입")
    private String contentType;

    @ApiModelProperty("매체목록 (필수/구분자,)")
    @JsonIgnore
    @Length(min = 1, message = "{tps.article.error.length.sourceList}")
    @NotNull(message = "{tps.article.error.notnull.sourceList}")
    private String sourceList;

    @ApiModelProperty("출판 카테고리")
    private String pressCategory;

    @ApiModelProperty("벌크여부")
    private String bulkYn;

    @ApiModelProperty("서비스여부")
    private String serviceFlag;

    public ArticleSearchDTO() {
        super(ArticleBasicVO.class, "totalId,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.masterCode = TpsConstants.SEARCH_TYPE_ALL;
        this.contentType = TpsConstants.SEARCH_TYPE_ALL;
        this.pressCategory = TpsConstants.SEARCH_TYPE_ALL;
        this.bulkYn = TpsConstants.SEARCH_TYPE_ALL;
        this.serviceFlag = TpsConstants.SEARCH_TYPE_ALL;
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
