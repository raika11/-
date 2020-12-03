package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
public class CodeMgtSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -8371179050668989365L;

    /**
     * 그룹코드
     */
    @NotNull(message = "{tps.codeMgt.error.invalid.grpCd}")
    private String grpCd;

    /**
     * 검색타입
     */
    private String searchType;

    /**
     * 검색어
     */
    private String keyword;

    // 검색 조건의 기본값을 설정
    public CodeMgtSearchDTO() {
        super("cdOrd,asc");
        searchType = TpsConstants.SEARCH_TYPE_ALL;
    }
}
