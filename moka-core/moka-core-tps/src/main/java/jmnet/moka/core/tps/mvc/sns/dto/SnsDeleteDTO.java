package jmnet.moka.core.tps.mvc.sns.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * sns 삭제용
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("SNS 게시 제거 DTO")
public class SnsDeleteDTO implements Serializable {

    /**
     * SNS 기사 ID
     */
    @ApiModelProperty("SNS 기사 ID")
    @NotEmpty(message = "{tps.sns.error.notempty.snsId}")
    @Length(max = 50, message = "{tps.sns.error.length.snsId}")
    private String snsId;

    /**
     * 기사 ID
     */
    @ApiModelProperty("기사 ID")
    @Min(value = 0, message = "{tps.sns.error.notempty.totalId}")
    private Long totalId;

    /**
     * 예약일시
     */
    @ApiModelProperty("예약일시")
    @DTODateTimeFormat
    private Date reserveDt;

    @ApiModelProperty("SNS 유형")
    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;

}
