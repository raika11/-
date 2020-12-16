package jmnet.moka.core.tps.mvc.columnist.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 사이트바로가기 DTO
 * 2020. 11. 16. obiwan 최초생성
 * </pre>
 *
 * @author obiwan
 * @since 2020. 11. 16. 오후 1:32:16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("칼럼니스트 DTO")
public class ColumnistDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722652118L;

    public static final Type TYPE = new TypeReference<List<ColumnistDTO>>() {
    }.getType();

    /**
     * int	10,0 NO	일련번호
     */
    @Min(value = 0, message = "{tps.columnist.error.pattern.seqNo}")
    private Long seqNo;

    /**
     * char	1   ('O')   NO	내외부구분(I내부,O외부)
     */
    @NotNull(message = "{tps.columnist.error.notnull.inout}")
    @Pattern(regexp = "[I|O]{1}$", message = "{tps.columnist.error.pattern.inout}")
    @Builder.Default
    private String inout = "O";

    /**
     * char	1   ('N')	NO	상태(유효/정지)
     */
    @NotNull(message = "{tps.columnist.error.notnull.status}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.columnist.error.pattern.status}")
    @Builder.Default
    private String status = MokaConstants.YES;

    /**
     * int	10,0((0))   NO	기자일련번호
     */
    @Min(value = 0, message = "{tps.columnist.error.pattern.repSeq}")
    private Long repSeq;

    /**
     * nvarchar	30		NO	칼럼니스트이름
     */
    @NotNull(message = "{tps.columnist.error.notnull.columnistNm}")
    @Length(max = 30, message = "{tps.columnist.error.length.columnistNm}")
    private String columnistNm;

    /**
     * varchar	512		YES	이메일
     */
    @Length(max = 512, message = "{tps.columnist.error.length.email}")
    private String email;

    /**
     * nvarchar	200			YES	직책
     */
    @Length(max = 200, message = "{tps.columnist.error.length.position}")
    private String position;

    /**
     * varchar	200			YES	프로필사진
     */
    @Length(max = 200, message = "{tps.columnist.error.length.profilePhoto}")
    private String profilePhoto;

    /**
     * nvarchar	500			YES	프로필
     */
    @Length(max = 500, message = "{tps.columnist.error.length.profile}")
    private String profile;

    /**
     * 등록일자
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 등록자아이디
     */
    private String regId;

    /**
     * 수정일자
     */
    @DTODateTimeFormat
    private Date modDt;

    /**
     * 수정자아이디
     */
    private String modId;
}
