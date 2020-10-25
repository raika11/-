/**
 * msp-tps StyleSearchDTO.java 2020. 4. 29. 오후 2:54:28 ssc
 */
package jmnet.moka.core.tps.mvc.skin.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <pre>
 *
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 4. 29. 오후 2:54:28
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class SkinSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 4193591098798538945L;

    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    private String serviceType;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public SkinSearchDTO() {
        super("skinName,asc");
    }
}
