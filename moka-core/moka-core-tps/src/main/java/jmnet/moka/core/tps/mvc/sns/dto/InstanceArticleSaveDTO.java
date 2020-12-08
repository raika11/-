package jmnet.moka.core.tps.mvc.sns.dto;

import java.io.Serializable;
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
    private Long totalId;

    /**
     * iud
     */
    private String iud;

    /**
     * 소스 코드
     */
    private String sourceCode;

}
