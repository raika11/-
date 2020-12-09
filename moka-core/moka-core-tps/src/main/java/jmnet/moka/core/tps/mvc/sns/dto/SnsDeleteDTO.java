package jmnet.moka.core.tps.mvc.sns.dto;

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
public class SnsDeleteDTO implements Serializable {

    /**
     * SNS 기사ID
     */
    @NotEmpty(message = "{tps.sns.error.notempty.snsId}")
    private String snsId;

    /**
     * message
     */
    @NotEmpty(message = "{tps.article.error.notempty.totalId}")
    @Min(value = 0, message = "{tps.article.error.min.totalId}")
    private Long totalId;

    /**
     * 예약일시
     */
    @DTODateTimeFormat
    private Date reserveDt;

    @Builder.Default
    @Length(max = 2, message = "{tps.sns.error.length.snsType}")
    private SnsTypeCode snsType = SnsTypeCode.FB;

}
