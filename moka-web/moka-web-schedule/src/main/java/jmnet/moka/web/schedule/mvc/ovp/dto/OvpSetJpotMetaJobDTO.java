package jmnet.moka.web.schedule.mvc.ovp.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * OvpSetJpotMetaJobDTO
 *
 * @author 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ApiModel(description = "UPA_JPOD_METADATA_EDIT procedure 실행용 DTO")
public class OvpSetJpotMetaJobDTO implements Serializable {

    private static final long serialVersionUID = -1L;

    /**
     * STAT_DATE
     */
    @ApiModelProperty("STAT_DATE")
    private String statDate;

    /**
     * VOD_CODE
     */
    @ApiModelProperty("VOD_CODE")
    private String vodCode;

    /**
     * PLAY_PV
     */
    @ApiModelProperty("PLAY_PV")
    private Long playPv;

    /**
     * PLAY_UV
     */
    @ApiModelProperty("PLAY_UV")
    private Long playUv;

    /**
     * PLAY_TIME
     */
    @ApiModelProperty("PLAY_TIME")
    private Long playTime;

    /**
     * COMPLETE_CNT
     */
    @ApiModelProperty("COMPLETE_CNT")
    private Long completeCnt;

    /**
     * @return_value
     */
    @ApiModelProperty(hidden = true)
    private Long returnValue;

}
