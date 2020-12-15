package jmnet.moka.core.tps.mvc.sns.dto;

import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.Min;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
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
public class SnsPublishDTO implements Serializable {

    /**
     * 기사ID
     */
    @Min(value = 0, message = "{tps.article.error.min.totalId}")
    private Long totalId;

    /**
     * message
     */
    @Length(max = 300, message = "{tps.sns.error.length.message}")
    private String message;

    /**
     * 예약일시
     */
    @DTODateTimeFormat
    private Date reserveDt;


    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;

}
