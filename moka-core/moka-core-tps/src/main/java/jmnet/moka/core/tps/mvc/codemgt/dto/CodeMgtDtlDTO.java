package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
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
@ApiModel("간단 상세코드 DTO")
public class CodeMgtDtlDTO implements Serializable {

    private static final long serialVersionUID = -330485592864643853L;

    public static final Type TYPE = new TypeReference<List<CodeMgtDtlDTO>>() {
    }.getType();

    @ApiModelProperty("그룹코드(필수)")
    @NotNull(message = "{tps.codeMgtGrp.error.notnull.grpCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}")
    @Length(min = 1, max = 12, message = "{tps.codeMgtGrp.error.length.grpCd}")
    private String grpCd;

    @ApiModelProperty("상세코드(필수)")
    @NotNull(message = "{tps.codeMgt.error.notnull.dtlCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}")
    @Length(min = 1, max = 24, message = "{tps.codeMgt.error.length.dtlCd}")
    private String dtlCd;

    @ApiModelProperty("코드명(필수)")
    @NotNull(message = "{tps.codeMgt.error.notnull.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgt.error.pattern.cdNm}")
    @Length(min = 1, max = 512, message = "{tps.codeMgt.error.length.cdNm}")
    private String cdNm;

    @ApiModelProperty("상세코드 일련번호")
    @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}")
    private Long seqNo;

}
