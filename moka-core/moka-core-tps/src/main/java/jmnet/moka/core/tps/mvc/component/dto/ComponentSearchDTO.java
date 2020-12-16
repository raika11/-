package jmnet.moka.core.tps.mvc.component.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.Api;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

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
@Api(tags = {"컴포넌트 API"})
public class ComponentSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -7998111385290877921L;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    /**
     * 템플릿그룹(템플릿위치그룹)
     */
    private String templateGroup;

    /**
     * 페이징여부
     */
    private String usePaging;

    /**
     * 편집영역용 컴포넌트 조회
     */
    private String useArea;

    // 검색 조건의 기본값을 설정
    public ComponentSearchDTO() {
        super(ComponentVO.class, "componentSeq,desc");
        this.setUseTotal(MokaConstants.YES);
        this.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        this.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.templateGroup = TpsConstants.SEARCH_TYPE_ALL;
        this.usePaging = MokaConstants.YES;
        this.useArea = MokaConstants.NO;
    }

}
