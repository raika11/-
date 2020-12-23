/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.dto;

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

/**
 * Description: 수신기사 검색 DTO
 *
 * @author ssc
 * @since 2020-12-22
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("RcvArticleSearchDTO")
@ApiModel("수신기사 검색 DTO")
public class RcvArticleSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    //    @ApiModelProperty("판")
    //    @Pattern(regexp = "[0-9]*$", message = "{tps.article.error.pattern.pressPan}")
    //    private String pressPan;
    //
    //    @ApiModelProperty("면")
    //    @Pattern(regexp = "[0-9]*$", message = "{tps.article.error.pattern.pressMyun}")
    //    private String pressMyun;

    @ApiModelProperty("검색 시작일자(필수)")
    @NotNull(message = "{tps.rcv-article.error.notnull.startDay}")
    @DTODateTimeFormat
    private Date startDay;

    @ApiModelProperty("검색 종료일자(필수)")
    @NotNull(message = "{tps.rcv-article.error.notnull.endDay}")
    @DTODateTimeFormat
    private Date endDay;

    @ApiModelProperty("매체목록 (필수/구분자,)")
    @NotNull(message = "{tps.rcv-article.error.notnull.sourceList}")
    private String sourceList;

    @ApiModelProperty("부서")
    private String depart;

    @ApiModelProperty("등록상태(Y,B)")
    @Pattern(regexp = "^(all)|(Y)|(B)$", message = "{tps.rcv-article.error.pattern.status}")
    private String status;

    @ApiModelProperty("수정여부(U,D)")
    @Pattern(regexp = "^(all)|(U)|(D)$", message = "{tps.rcv-article.error.pattern.modify}")
    private String modify;

    public RcvArticleSearchDTO() {
        super(ArticleBasicVO.class, "rid,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

    /**
     * 종료일자(프로시져용)
     *
     * @return 종료일자
     */
    public String getEndDay() {
        if (this.endDay != null) {
            return McpDate.dateStr(this.endDay, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }

    /**
     * 시작일자(프로시져용)
     *
     * @return 시작일자
     */
    public String getStartDay() {
        if (this.startDay != null) {
            return McpDate.dateStr(this.startDay, MokaConstants.JSON_DATE_FORMAT);
        }
        return null;
    }
}
