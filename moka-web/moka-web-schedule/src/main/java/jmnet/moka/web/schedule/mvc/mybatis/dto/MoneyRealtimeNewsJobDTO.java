package jmnet.moka.web.schedule.mvc.mybatis.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * MoneyRealtimeNewsJobDTO
 *
 * @author 김정민
 * @since 2021-03-31
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ApiModel(description = "UPU_15RE_ARTICLE_LIST_SEL procedure 실행용 DTO")
public class MoneyRealtimeNewsJobDTO {

    /**
     * PAGE_INDEX
     */
    @ApiModelProperty("PAGE_INDEX")
    private Long pageIndex = 1L;

    /**
     * PAGE_SIZE
     */
    @ApiModelProperty("PAGE_SIZE")
    private Long pageSize = 20L;

    /**
     * SERVICE_CODE_LIST
     */
    @ApiModelProperty("SERVICE_CODE_LIST")
    private String serviceCodeList = "11,16";

    /**
     * USAGE_TYPE
     */
    @ApiModelProperty("USAGE_TYPE")
    private String usageType = "C";

    /**
     * EXCEPT_SOURCE_CODE_LIST
     */
    @ApiModelProperty("EXCEPT_SOURCE_CODE_LIST")
    private String exceptSourceCodeList = "1";

    /**
     * TOTAL_COUNT
     */
    @ApiModelProperty("TOTAL_COUNT")
    private Long totalCount = 0L;
}
