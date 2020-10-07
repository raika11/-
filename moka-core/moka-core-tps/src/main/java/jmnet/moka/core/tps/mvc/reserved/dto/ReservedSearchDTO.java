/**
 * msp-tps ReservedSearchDTO.java 2020. 6. 17. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:35:05
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class ReservedSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    @NotNull(message = "{tps.domain.error.invalid.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.invalid.domainId}")
    private String domainId;

    private String serviceType;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public ReservedSearchDTO() {
        super("reservedSeq,desc");
    }
}
