package jmnet.moka.core.tps.mvc.component.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 컴포넌트 검색 DTO
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("ComponentSearchDTO")
public class ComponentSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -7998111385290877921L;

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
    @Pattern(regexp = ".+", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    /**
     * 템플릿그룹(템플릿위치그룹)
     */
    private String tpZone;

    // 검색 조건의 기본값을 설정
    public ComponentSearchDTO() {
        super(ComponentVO.class, "componentSeq,desc");
        useTotal = MokaConstants.YES;
        searchType = TpsConstants.SEARCH_TYPE_ALL;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }

}
