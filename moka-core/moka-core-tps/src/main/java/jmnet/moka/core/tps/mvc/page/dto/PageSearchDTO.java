package jmnet.moka.core.tps.mvc.page.dto;

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

@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class PageSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 3122658693342650030L;

    @NotNull(message = "{tps.domain.error.invalid.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.invalid.domainId}")
    private String domainId;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public PageSearchDTO() {
        super("pageName,asc");
    }

}
