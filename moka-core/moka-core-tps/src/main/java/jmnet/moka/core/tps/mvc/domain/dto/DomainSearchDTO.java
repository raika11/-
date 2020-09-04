/**
 * msp-tps DomainSearchDTO.java 2020. 2. 14. 오후 2:01:09 ssc
 */
package jmnet.moka.core.tps.mvc.domain.dto;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <pre>
 * 도메인 검색조건
 * 2020. 2. 14. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 2. 14. 오후 2:01:09
 * @author ssc
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class DomainSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7078089741509746594L;
    @NotNull(message = "{tps.domain.error.invalid.mediaId1}")
    @Length(min = 1, max = 2, message = "{tps.domain.error.invalid.mediaId2}")
    private String mediaId;

    // 검색 조건의 기본값을 설정
    public DomainSearchDTO() {
        super("domainId,asc");
    }
}
