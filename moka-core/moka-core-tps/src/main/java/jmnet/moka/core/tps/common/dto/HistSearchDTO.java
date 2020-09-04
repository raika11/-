package jmnet.moka.core.tps.common.dto;

import javax.validation.constraints.NotNull;
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
 * 히스토리 검색조건
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 21. 오전 11:17:39
 * @author ssc
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class HistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -6207554369251550982L;

    @NotNull(message = "{tps.common.error.invalid.seq}")
    private Long seq;

    private String searchType;

    private String keyword;

    // 정렬 기본값을 설정
    public HistSearchDTO() {
        super("createYmdt,desc");
    }
}
