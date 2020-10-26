package jmnet.moka.core.tps.mvc.page.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 페이지 검색 DTO
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("PageSearchDTO")
public class PageSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 3122658693342650030L;

    /**
     * 검색타입
     */
    private String searchType;

    /**
     * 검색어
     */
    private String keyword;

    /**
     * 총갯수 사용여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.useTotal}")
    private String useTotal;

    /**
     * 총갯수
     */
    private Long total;

    /**
     * 검색결과 성공여부
     */
    private Integer returnValue;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    // 검색 조건의 기본값을 설정
    public PageSearchDTO() {
        super("pageName,asc");
        useTotal = MokaConstants.YES;
        searchType = TpsConstants.SEARCH_TYPE_ALL;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }

}
