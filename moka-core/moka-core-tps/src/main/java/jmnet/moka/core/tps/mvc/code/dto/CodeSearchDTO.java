package jmnet.moka.core.tps.mvc.code.dto;

import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.code.vo.CodeVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 코드 검색 DTO
 * 
 * @author jeon
 *
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("codeSearchDTO")
public class CodeSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5956572673684444343L;

    private String codeLevel;

    private String largeCodeId;

    private String middleCodeId;

    private String smallCodeId;

    private String searchType;

    private String keyword;

    @JsonIgnore
    private String delimiter;

    // 검색 조건의 기본값을 설정
    public CodeSearchDTO() {
        super(CodeVO.class, "seq,desc");
        this.delimiter = " > ";
        this.codeLevel = "2";
    }
}
