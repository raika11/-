package jmnet.moka.core.tps.mvc.ad.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.ad.vo.AdVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("adSearchDTO")
@ApiModel("광고 DTO")
public class AdSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -4988052502214963085L;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    public AdSearchDTO() {
        super(AdVO.class, "adSeq,desc");
    }

}
