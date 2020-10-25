/**
 * msp-tps TemplateSearchDTO.java 2020. 2. 14. 오후 4:54:01 ssc
 */
package jmnet.moka.core.tps.mvc.template.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.template.vo.TemplateVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * 템플릿 검색 DTO
 * 2020. 2. 14. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 2. 14. 오후 4:54:01
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("TemplateSearchDTO")
public class TemplateSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5900493133914418299L;

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

    /**
     * 템플릿그룹(템플릿위치그룹)
     */
    private String tpZone;

    /**
     * 템플릿 최소 가로사이즈
     */
    private Integer widthMin;

    /**
     * 템플릿 최대 가로사이즈
     */
    private Integer widthMax;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public TemplateSearchDTO() {
        super(TemplateVO.class, "templateSeq,desc");
        useTotal = MokaConstants.YES;
        searchType = TpsConstants.SEARCH_TYPE_ALL;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
