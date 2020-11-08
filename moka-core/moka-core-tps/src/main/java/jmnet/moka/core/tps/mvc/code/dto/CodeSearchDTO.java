package jmnet.moka.core.tps.mvc.code.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
 * 코드 검색 DTO
 * 
 * @author jeon
 *
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("CodeSearchDTO")
public class CodeSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5956572673684444343L;

    /**
     * 사용여부
     */
    private String usedYn;

//    @JsonIgnore
//    private String delimiter;

    // 검색 조건의 기본값을 설정
    public CodeSearchDTO() {
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        this.usedYn = MokaConstants.YES;
//        this.delimiter = " > ";
    }
}
