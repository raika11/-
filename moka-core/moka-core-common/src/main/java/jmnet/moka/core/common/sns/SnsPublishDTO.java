package jmnet.moka.core.common.sns;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.Min;
import jmnet.moka.core.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * sns 게시용
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("SNS 게시 DTO")
public class SnsPublishDTO implements Serializable {

    /**
     * 기사 ID
     */
    @ApiModelProperty("기사 ID")
    @Min(value = 0, message = "{tps.article.error.min.totalId}")
    private Long totalId;

    /**
     * message
     */
    @ApiModelProperty("message")
    @Length(max = 300, message = "{tps.sns.error.length.message}")
    private String message;

    /**
     * 예약일시
     */
    @ApiModelProperty("예약일시")
    @DTODateTimeFormat
    private Date reserveDt;


    @ApiModelProperty("SNS 유형")
    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;


    private String tokenCode;

}
