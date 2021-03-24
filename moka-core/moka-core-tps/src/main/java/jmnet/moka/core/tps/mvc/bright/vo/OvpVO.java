package jmnet.moka.core.tps.mvc.bright.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.vo
 * ClassName : OvpVO
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:09
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("OVP 정보 VO")
public class OvpVO implements Serializable {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("아이디")
    private String id;

    @ApiModelProperty("대표이미지")
    private String thumbFileName;

    @ApiModelProperty("OVP명")
    private String name;

    @ApiModelProperty("상태")
    private String state;

    @ApiModelProperty("재생시간")
    private String duration;

    @ApiModelProperty("생성일자")
    @DTODateTimeFormat
    private Date regDt;
}
