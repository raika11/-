package jmnet.moka.core.tps.common.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 유효성오류 정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 21. 오전 11:17:56
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class InvalidDataDTO implements Serializable {

    private static final long serialVersionUID = 912843202923110759L;

    private String field;

    private String reason;

    private String extra;

    public InvalidDataDTO(String field, String reason) {
        super();
        this.field = field;
        this.reason = reason;
        this.extra = null;
    }
}
