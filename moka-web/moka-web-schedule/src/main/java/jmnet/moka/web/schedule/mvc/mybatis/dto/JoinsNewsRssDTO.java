package jmnet.moka.web.schedule.mvc.mybatis.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JoinsNewsRssDTO
 *
 * @author 김정민
 * @since 2021-03-19
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ApiModel(description = "UPA_ARTICLE_BASIC_SEL procedure 실행용 DTO")
public class JoinsNewsRssDTO implements Serializable {

    private static final long serialVersionUID = -1L;

    /**
     * PI_PAGECOUNT
     */
    @ApiModelProperty("PI_PAGECOUNT")
    private String piPageCount = "30";

    /**
     * PI_PAGENUM
     */
    @ApiModelProperty("PI_PAGENUM")
    private String piPageNum = "1";

    /**
     * PI_CTG_ID
     */
    @ApiModelProperty("PI_CTG_ID")
    private String piCtgId = "-1";
}
