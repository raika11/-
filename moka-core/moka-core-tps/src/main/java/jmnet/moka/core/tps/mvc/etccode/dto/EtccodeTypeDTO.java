package jmnet.moka.core.tps.mvc.etccode.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 공통코드 그룹 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오전 10:24:33
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class EtccodeTypeDTO implements Serializable {

    private static final long serialVersionUID = -6243730311717090869L;

    public static final Type TYPE = new TypeReference<List<EtccodeTypeDTO>>() {}.getType();

    private Long codeTypeSeq;

    @NotNull(message = "{tps.etccodeType.error.invalid.codeTypeId}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$",
            message = "{tps.etccodeType.error.invalid.codeTypeId2}")
    private String codeTypeId;

    @NotNull(message = "{tps.etccodeType.error.invalid.codeTypeName}")
    @Pattern(regexp = ".+", message = "{tps.etccodeType.error.invalid.codeTypeName}")
    private String codeTypeName;

    private Long countEtccode;  // 하위 코드 갯수. 디비에는 없는 데이타임.


}
