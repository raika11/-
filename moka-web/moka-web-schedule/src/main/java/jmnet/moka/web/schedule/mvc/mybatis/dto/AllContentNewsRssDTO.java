package jmnet.moka.web.schedule.mvc.mybatis.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AllContentNewsRssDTO
 *
 * @author 김정민
 * @since 2021-03-29
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ApiModel(description = "USP_SCHEDULE_ARTICLE_BASIC_LIST_SEL procedure 실행용 DTO")
public class AllContentNewsRssDTO implements Serializable {

    private static final long serialVersionUID = -1L;

    /**
     * PAGECOUNT
     */
    @ApiModelProperty("PAGECOUNT")
    private String pageCount = "30";

    /**
     * PAGENUM
     */
    @ApiModelProperty("PAGENUM")
    private String pageNum = "1";

    /**
     * CTG_ID
     */
    @ApiModelProperty("CTG_ID")
    private Long ctgId = -1L;

    /**
     * Media_CD
     */
    @ApiModelProperty("Media_CD")
    private String mediaCd;

    /**
     * PI_PAGECOUNT
     */
    @ApiModelProperty("CTG_ID_STR")
    private String ctgIdStr;
}
