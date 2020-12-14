package jmnet.moka.core.tps.mvc.sns.dto;

import java.io.Serializable;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Facebook Article instance 등록 정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InstanceArticleSaveDTO implements Serializable {

    /**
     * 기사ID
     */
    @NotEmpty(message = "{tps.article.error.notempty.totalId}")
    @Min(value = 0, message = "{tps.article.error.min.totalId}")
    private Long totalId;

    /**
     * iud
     */
    @NotEmpty(message = "{tps.sns.error.notempty.uid}")
    private String iud;

    /**
     * 소스 코드
     */
    @NotEmpty(message = "{tps.article.error.length.sourceCode}")
    @Min(value = 0, message = "{tps.article.error.length.sourceCode}")
    private String sourceCode;

}
