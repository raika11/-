package jmnet.moka.core.tps.mvc.sns.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * Facebook Article instance 등록 정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("인스턴스 아티클 저장 DTO")
public class InstanceArticleSaveDTO implements Serializable {

    /**
     * 기사 ID
     */
    @ApiModelProperty("기사 ID")
    @Min(value = 0, message = "{tps.article.error.min.totalId}")
    private Long totalId;

    /**
     * iud
     */
    @ApiModelProperty("iud")
    @NotEmpty(message = "{tps.sns.error.notempty.uid}")
    @Length(max = 1, message = "{tps.sns.error.length.iud}")
    private String iud;

    /**
     * 소스 코드
     */
    @ApiModelProperty("소스 코드")
    @NotEmpty(message = "{tps.article.error.length.sourceCode}")
    @Min(value = 0, message = "{tps.article.error.length.sourceCode}")
    private String sourceCode;

}
