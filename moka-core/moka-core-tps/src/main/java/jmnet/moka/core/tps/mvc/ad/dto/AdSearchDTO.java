package jmnet.moka.core.tps.mvc.ad.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
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
public class AdSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -4988052502214963085L;

    @NotNull(message = "{tps.domain.error.pattern.domainId}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    private String searchType;

    private String keyword;

    public AdSearchDTO() {
        super(AdVO.class, "adSeq,desc");
    }

}
