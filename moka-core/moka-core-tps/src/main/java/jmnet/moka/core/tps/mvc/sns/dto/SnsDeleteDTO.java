package jmnet.moka.core.tps.mvc.sns.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String snsId;

    /**
     * message
     */
    private Long totalId;

    @Builder.Default
    private String snsType = "FB";

}
