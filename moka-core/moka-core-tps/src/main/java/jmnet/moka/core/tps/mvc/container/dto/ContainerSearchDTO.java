package jmnet.moka.core.tps.mvc.container.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 컨테이너 검색 DTO
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ContainerSearchDTO")
@ApiModel("컨테이너 검색 DTO")
public class ContainerSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -3544871391843287828L;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    @ApiModelProperty("페이징여부")
    private String usePaging;

    @ApiModelProperty("컨테이너그룹")
    private String containerGroup;

    // 검색 조건의 기본값을 설정
    public ContainerSearchDTO() {
        super(ContainerVO.class, "containerSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.usePaging = MokaConstants.YES;
    }
}
