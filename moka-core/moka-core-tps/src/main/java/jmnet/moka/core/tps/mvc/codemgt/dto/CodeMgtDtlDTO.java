package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.common.utils.McpString;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

/**
 * <pre>
 * 공통코드 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오전 10:20:50
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeMgtDtlDTO implements Serializable {

    private static final long serialVersionUID = -330485592864643853L;

    public static final Type TYPE = new TypeReference<List<CodeMgtDtlDTO>>() {
    }.getType();

    /**
     * 코드명
     */
    @NotNull(message = "{tps.codeMgt.error.notnull.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgt.error.pattern.cdNm}")
    @Length(min = 1, max = 512, message = "{tps.codeMgt.error.length.cdNm}")
    private String cdNm;

    @NotNull(message = "{tps.codeMgtGrp.error.notnull.grpCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}")
    @Length(min = 1, max = 12, message = "{tps.codeMgtGrp.error.length.grpCd}")
    private String grpCd;

    /**
     * 상세코드
     */
    @NotNull(message = "{tps.codeMgt.error.notnull.cdNm}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}")
    @Length(min = 1, max = 24, message = "{tps.codeMgt.error.length.dtlCd}")
    private String dtlCd;

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}")
    private Long seqNo;

}
