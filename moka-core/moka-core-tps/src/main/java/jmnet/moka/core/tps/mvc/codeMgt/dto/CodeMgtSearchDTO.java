package jmnet.moka.core.tps.mvc.codeMgt.dto;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.*;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class CodeMgtSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -8371179050668989365L;

    @NotNull(message = "{tps.codeMgt.error.invalid.grpCd}")
    private String grpCd;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public CodeMgtSearchDTO() {
        super("cdOrd,asc");
    }
}
