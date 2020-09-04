package jmnet.moka.core.tps.mvc.etccode.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 공통코드 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오전 10:20:50
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class EtccodeDTO implements Serializable {

    private static final long serialVersionUID = -330485592864643853L;

    public static final Type TYPE = new TypeReference<List<EtccodeDTO>>() {}.getType();

    private Long seq;

    @NotNull(message = "{tps.etccodeType.error.invalid.codeTypeId}")
    private EtccodeTypeDTO etccodeType;

    @NotNull(message = "{tps.etccode.error.invalid.codeId}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.etccode.error.invalid.codeId2}")
    private String codeId;

    @NotNull(message = "{tps.etccode.error.invalid.codeName}")
    @Pattern(regexp = ".+", message = "{tps.etccode.error.invalid.codeName}")
    private String codeName;

    private String codeNameEtc1;

    private String codeNameEtc2;

    private String codeNameEtc3;

    @NotNull(message = "{tps.etccode.error.invalid.codeOrder}")
    @Min(value = -1, message = "{tps.etccode.error.invalid.codeOrder}")
    private int codeOrder;

    @Pattern(regexp = "^[Y|N]?$", message = "{tps.etccode.error.invalid.useYn}")
    private String useYn;

}
