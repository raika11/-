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
import jmnet.moka.core.common.MokaConstants;
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
 * 공통코드 그룹 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오전 10:24:33
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("기타코드 그룹 DTO")
public class CodeMgtGrpDTO implements Serializable {

    private static final long serialVersionUID = -6243730311717090869L;

    public static final Type TYPE = new TypeReference<List<CodeMgtGrpDTO>>() {
    }.getType();

    @ApiModelProperty("그룹코드 일련번호")
    @Min(value = 0, message = "{tps.codeMgtGrp.error.min.seqNo}")
    private Long seqNo;

    @ApiModelProperty("그룹코드(필수)")
    @NotNull(message = "{tps.codeMgtGrp.error.notnull.grpCd}")
    @Pattern(regexp = "^[0-9a-zA-Z_\\-\\/]+$", message = "{tps.codeMgtGrp.error.pattern.grpCd}")
    @Length(min = 1, max = 12, message = "{tps.codeMgtGrp.error.length.grpCd}")
    private String grpCd;

    @ApiModelProperty("사용여부")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgtGrp.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    @ApiModelProperty("숨김여부")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.codeMgtGrp.error.pattern.secretYn}")
    private String secretYn = MokaConstants.NO;

    @ApiModelProperty("코드명(필수)")
    @NotNull(message = "{tps.codeMgtGrp.error.notnull.cdNm}")
    @Pattern(regexp = ".+", message = "{tps.codeMgtGrp.error.pattern.cdNm}")
    @Length(min = 1, max = 100, message = "{tps.codeMgtGrp.error.length.cdNm}")
    private String cdNm;

    @ApiModelProperty("코드영문명")
    @Length(max = 100, message = "{tps.codeMgtGrp.error.length.cdEngNm}")
    private String cdEngNm;

    @ApiModelProperty("코드코멘트")
    @Length(max = 100, message = "{tps.codeMgtGrp.error.length.cdComment}")
    private String cdComment;

    @ApiModelProperty("하위 기타코드 갯수. 디비에는 없는 데이타임.")
    private Long countCodeMgt;

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
