package jmnet.moka.web.schedule.mvc.mybatis.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JReporterListJobDTO
 *
 * @author 김정민
 * @since 2021-03-18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ApiModel(description = "UPA_SCHEDULE_15RE_REPORTER_LIST_SEL procedure 실행용 DTO")
public class JReporterListJobDTO implements Serializable {

    private static final long serialVersionUID = -1L;

    /**
     * PAGE_INDEX
     */
    @ApiModelProperty("PAGE_INDEX")
    private Long pageIndex = 1L;

    /**
     * PAGE_SIZE
     */
    @ApiModelProperty("PAGE_SIZE")
    private Long pageSize = 3000L;

    /**
     * R1_CD
     */
    @ApiModelProperty("R1_CD")
    private String r1Cd;

    /**
     * R2_CD
     */
    @ApiModelProperty("R2_CD")
    private String r2Cd;

    /**
     * R3_CD
     */
    @ApiModelProperty("R3_CD")
    private String r3Cd;

    /**
     * R4_CD
     */
    @ApiModelProperty("R4_CD")
    private String r4Cd;

    /**
     * REP_NAME
     */
    @ApiModelProperty("REP_NAME")
    private String repName = "";

    /**
     * USED_TOTAL_COUNT
     */
    @ApiModelProperty("USED_TOTAL_COUNT")
    private String usedTotalCount = "Y";

}
