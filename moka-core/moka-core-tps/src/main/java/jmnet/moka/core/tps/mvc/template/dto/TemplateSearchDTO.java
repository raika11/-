/**
 * msp-tps TemplateSearchDTO.java 2020. 2. 14. 오후 4:54:01 ssc
 */
package jmnet.moka.core.tps.mvc.template.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
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
 * @author ssc
 * @since 2020. 2. 14. 오후 4:54:01
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("TemplateSearchDTO")
@ApiModel("템플릿 검색 DTO")
public class TemplateSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5900493133914418299L;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    @ApiModelProperty("템플릿그룹(템플릿위치그룹)")
    private String templateGroup;

    @ApiModelProperty("템플릿 최소 가로사이즈")
    private Integer widthMin;

    @ApiModelProperty("템플릿 최대 가로사이즈")
    private Integer widthMax;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public TemplateSearchDTO() {
        super(TemplateVO.class, "templateSeq,desc");
        this.setUseTotal(MokaConstants.YES);
        this.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        this.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.templateGroup = TpsConstants.SEARCH_TYPE_ALL;
    }

    public Integer getSortFlag() {
        // 1: TEMPLATE_NAME,ASC, 2: TEMPLATE_NAME,DESC, 3: TEMPLATE_SEQ,DESC, 4: TEMPLATE_SEQ,ASC
        for (String sort : this.getSort()) {
            sort = sort
                    .toUpperCase()
                    .replace(" ", "");
            if (sort.equals("TEMPLATENAME,ASC")) {
                return 1;
            }
            if (sort.equals("TEMPLATENAME,DESC")) {
                return 2;
            }
            if (sort.equals("TEMPLATESEQ,ASC")) {
                return 3;
            }
            if (sort.equals("TEMPLATESEQ,DESC")) {
                return 4;
            }
        }
        return 1;
    }
}
