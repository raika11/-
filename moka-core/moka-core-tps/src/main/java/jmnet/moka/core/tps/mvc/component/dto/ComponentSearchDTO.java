package jmnet.moka.core.tps.mvc.component.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
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
 * 
 * @author jeon
 *
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("componentSearchDTO")
public class ComponentSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -7998111385290877921L;

    @NotNull(message = "{tps.domain.error.invalid.domainId}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.domainId}")
    private String domainId;

    private String searchType;

    private String keyword;
    
    private String tpZone;

    // 검색 조건의 기본값을 설정
    public ComponentSearchDTO() {
        super(ComponentVO.class, "componentSeq,desc");
    }

}
