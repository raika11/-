/**
 * msp-tps StyleSearchDTO.java 2020. 4. 29. 오후 2:54:28 ssc
 */
package jmnet.moka.core.tps.mvc.style.dto;

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
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 2:54:28
 * @author ssc
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class StyleSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 403421813646155029L;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public StyleSearchDTO() {
        super("styleName,asc");
    }
}
