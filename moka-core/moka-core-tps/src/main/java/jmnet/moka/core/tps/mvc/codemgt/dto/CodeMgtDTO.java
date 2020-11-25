package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.utils.McpString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

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
public class CodeMgtDTO implements Serializable {

    private static final long serialVersionUID = -330485592864643853L;

    public static final Type TYPE = new TypeReference<List<CodeMgtDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}")
    private Long seqNo;

    /**
     * 그룹코드
     */
    @NotNull(message = "{tps.codeMgtGrp.error.notnull.grpCd}")
    private CodeMgtGrpDTO codeMgtGrp;

    /**
     * 상세코드
     */
    @NotNull(message = "{tps.codeMgt.error.notnull.dtlCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}")
    @Length(min = 1, max = 24, message = "{tps.codeMgt.error.length.dtlCd}")
    private String dtlCd;

    /**
     * 코드순서
     */
    @NotNull(message = "{tps.codeMgt.error.notnull.cdOrd}")
    @Min(value = 1, message = "{tps.codeMgt.error.min.cdOrd}")
    @Builder.Default
    private Integer cdOrd = 1;

    /**
     * 코드명
     */
    @NotNull(message = "{tps.codeMgt.error.notnull.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgt.error.pattern.cdNm}")
    @Length(min = 1, max = 512, message = "{tps.codeMgt.error.length.cdNm}")
    private String cdNm;

    /**
     * 코드영문명
     */
    @Length(max = 100, message = "{tps.codeMgt.error.length.cdEngNm}")
    private String cdEngNm;

    /**
     * 코드코멘트
     */
    @Length(max = 100, message = "{tps.codeMgt.error.length.cdComment}")
    private String cdComment;

    /**
     * 코드기타1
     */
    @Length(max = 512, message = "{tps.codeMgt.error.length.cdNmEtc1}")
    private String cdNmEtc1;

    /**
     * 코드기타2
     */
    @Length(max = 1024, message = "{tps.codeMgt.error.length.cdNmEtc2}")
    private String cdNmEtc2;

    /**
     * 코드기타3
     */
    @Length(max = 1024, message = "{tps.codeMgt.error.length.cdNmEtc3}")
    private String cdNmEtc3;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgt.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = McpString.YES;

}
