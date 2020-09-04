package jmnet.moka.core.tps.mvc.ad.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.ad.vo.AdVO;
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
@Alias("adSearchDTO")
public class AdSearchDTO extends SearchDTO {
    
    private static final long serialVersionUID = -4988052502214963085L;
    
    @NotNull(message = "{tps.domain.error.invalid.domainId}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.domainId}")
    private String domainId;
    
    private String searchType;
    
    private String keyword;
    
    public AdSearchDTO() {
        super(AdVO.class, "adSeq,desc");
    }

}
