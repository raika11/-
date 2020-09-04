package jmnet.moka.core.tps.common.dto;

import javax.validation.constraints.Pattern;
import org.springframework.data.domain.Pageable;
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
 * 컨테이너,컴포넌트,템플릿,데이타셋,광고가 사용된 관련 페이지,컨테이너,본문 조회조건
 * 2020. 4. 20. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 20. 오후 1:39:07
 * @author jeon
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class RelSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -5762199095013181372L;

    // private String searchType;
    // private String keyword;

    // @NotNull(message = "{tps.common.error.invalid.relType}")
    @Pattern(regexp = "^(PG)|(CT)|(CP)|(TP)|(CS)|(AD)|(TP)|(RS)$", message = "{tps.common.error.invalid.relType}")
    private String relType;

    // @NotNull(message = "{tps.common.error.invalid.seq}")
    private Long relSeq;

    @Pattern(regexp = "^(CT)|(CP)|(TP)|(AD)|(DS)|(DOMAIN)|()$",
            message = "{tps.common.error.invalid.relSeqType}")
    private String relSeqType;

    // @NotNull(message = "{tps.common.error.invalid.domainId}")
    private String domainId;
    
    // 검색 조건의 기본값을 설정
    public RelSearchDTO() {
        super("pageSeq,desc");
    }
    
    public Pageable getPageableAfterClearSort() {
        super.clearSort();
        return super.getPageable();
    }
}
