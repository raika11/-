package jmnet.moka.core.tps.mvc.sns.dto;

import java.io.Serializable;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Long totalId;

    /**
     * message
     */
    private String message;

    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;

}
