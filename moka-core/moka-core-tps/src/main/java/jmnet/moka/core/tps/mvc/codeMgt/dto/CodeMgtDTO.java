package jmnet.moka.core.tps.mvc.codeMgt.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 공통코드 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오전 10:20:50
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeMgtDTO implements Serializable {

    private static final long serialVersionUID = -330485592864643853L;

    public static final Type TYPE = new TypeReference<List<CodeMgtDTO>>() {}.getType();

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.codeMgt.error.invalid.seqNo}")
    private Long seqNo;

    /**
     * 그룹코드
     */
    @NotNull(message = "{tps.codeMgt.error.invalid.grpCd}")
    private CodeMgtGrpDTO codeMgtGrp;

    /**
     * 상세코드
     */
    @NotNull(message = "{tps.codeMgt.error.invalid.dtlCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.invalid.dtlCd2}")
    @Length(min = 1, max = 24, message = "{tps.codeMgt.error.length.dtlCd}")
    private String dtlCd;

    /**
     * 코드순서
     */
    @NotNull(message = "{tps.codeMgt.error.invalid.cdOrd}")
    @Min(value = 1, message = "{tps.codeMgt.error.invalid.cdOrd}")
    @Builder.Default
    private Integer cdOrd = 1;

    /**
     * 코드명
     */
    @NotNull(message = "{tps.codeMgt.error.invalid.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgt.error.invalid.cdNm}")
    @Length(min = 1, max = 100, message = "{tps.codeMgt.error.invalid.cdNm2}")
    private String cdNm;

    /**
     * 코드영문명
     */
    @Length(max = 100, message = "{tps.codeMgt.error.invalid.cdEngNm}")
    private String cdEngNm;

    /**
     * 코드코멘트
     */
    @Length(max = 100, message = "{tps.codeMgt.error.invalid.cdComment}")
    private String cdComment;

    /**
     * 코드기타1
     */
    @Length(max = 512, message = "{tps.codeMgt.error.invalid.cdNmEtc1}")
    private String cdNmEtc1;

    /**
     * 코드기타2
     */
    @Length(max = 1024, message = "{tps.codeMgt.error.invalid.cdNmEtc2}")
    private String cdNmEtc2;

    /**
     * 코드기타3
     */
    @Length(max = 1024, message = "{tps.codeMgt.error.invalid.cdNmEtc3}")
    private String cdNmEtc3;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgt.error.invalid.usedYn}")
    @Builder.Default
    private String usedYn = "Y";

}
