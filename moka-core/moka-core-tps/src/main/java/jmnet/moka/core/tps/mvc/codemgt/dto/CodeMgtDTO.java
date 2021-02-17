package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
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
@ApiModel("상세코드 DTO")
public class CodeMgtDTO implements Serializable {

    private static final long serialVersionUID = -330485592864643853L;

    public static final Type TYPE = new TypeReference<List<CodeMgtDTO>>() {
    }.getType();

    @ApiModelProperty("일련번호")
    @Min(value = 0, message = "{tps.codeMgt.error.min.seqNo}")
    private Long seqNo;

    @ApiModelProperty("그룹코드(필수)")
    @NotNull(message = "{tps.codeMgtGrp.error.notnull.grpCd}")
    private CodeMgtGrpDTO codeMgtGrp;

    @ApiModelProperty("상세코드(필수)")
    @NotNull(message = "{tps.codeMgt.error.notnull.dtlCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgt.error.pattern.dtlCd}")
    @Length(min = 1, max = 24, message = "{tps.codeMgt.error.length.dtlCd}")
    private String dtlCd;

    @ApiModelProperty("코드순서(필수)")
    @NotNull(message = "{tps.codeMgt.error.notnull.cdOrd}")
    @Min(value = 1, message = "{tps.codeMgt.error.min.cdOrd}")
    @Builder.Default
    private Integer cdOrd = 1;

    @ApiModelProperty("코드명(필수)")
    @NotNull(message = "{tps.codeMgt.error.notnull.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgt.error.pattern.cdNm}")
    @Length(min = 1, max = 512, message = "{tps.codeMgt.error.length.cdNm}")
    private String cdNm;

    @ApiModelProperty("코드영문명")
    @Length(max = 100, message = "{tps.codeMgt.error.length.cdEngNm}")
    private String cdEngNm;

    @ApiModelProperty("코드코멘트")
    @Length(max = 100, message = "{tps.codeMgt.error.length.cdComment}")
    private String cdComment;

    @ApiModelProperty("코드기타1")
    @Length(max = 512, message = "{tps.codeMgt.error.length.cdNmEtc1}")
    private String cdNmEtc1;

    @ApiModelProperty("코드기타2")
    @Length(max = 1024, message = "{tps.codeMgt.error.length.cdNmEtc2}")
    private String cdNmEtc2;

    @ApiModelProperty("코드기타3")
    @Length(max = 1024, message = "{tps.codeMgt.error.length.cdNmEtc3}")
    private String cdNmEtc3;

    @ApiModelProperty("사용여부(Y:사용, N:미사용)")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgt.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = McpString.YES;

    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty(value = "등록자", hidden = true)
    private MemberSimpleDTO regMember;

    @ApiModelProperty(value = "수정일시", hidden = true)
    @DTODateTimeFormat
    private Date modDt;

    @ApiModelProperty(value = "수정자", hidden = true)
    private MemberSimpleDTO modMember;

}
