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

    @Min(value = 0, message = "{tps.codeMgt.error.invalid.seqNo}")
    private Long seqNo;

    @NotNull(message = "{tps.codeMgt.error.invalid.grpCd}")
    private CodeMgtGrpDTO codeMgtGrp;

    @NotNull(message = "{tps.codeMgt.error.invalid.dtlCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.invalid.dtlCd2}")
    private String dtlCd;

    @NotNull(message = "{tps.codeMgt.error.invalid.cdOrd}")
    @Min(value = -1, message = "{tps.codeMgt.error.invalid.cdOrd}")
    private Integer cdOrd;

    @NotNull(message = "{tps.codeMgt.error.invalid.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgt.error.invalid.cdNm}")
    private String cdNm;

    private String cdEngNm;

    private String cdComment;

    private String cdNmEtc1;

    private String cdNmEtc2;

    private String cdNmEtc3;

    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgt.error.invalid.usedYn}")
    private String usedYn;

}
