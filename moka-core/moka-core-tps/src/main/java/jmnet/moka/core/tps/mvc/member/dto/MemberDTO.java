package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.group.dto.GroupMemberSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.dto
 * ClassName : MemberDTO
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 16:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("사용자 DTO")
public class MemberDTO {

    public static final Type TYPE = new TypeReference<List<MemberDTO>>() {
    }.getType();

    /**
     * 사용자ID
     */
    @ApiModelProperty("사용자ID")
    private String memberId;

    /**
     * 사용자명
     */
    @ApiModelProperty("사용자명")
    private String memberNm;

    /**
     * 상태(유효/정지)
     */
    @ApiModelProperty("상태(유효/정지)")
    @Builder.Default
    private MemberStatusCode status = MemberStatusCode.D;


    /**
     * 부서
     */
    @ApiModelProperty("부서")
    @Builder.Default
    private String dept = "";

    /**
     * 핸드폰번호
     */
    @ApiModelProperty("핸드폰번호")
    @Builder.Default
    @Pattern(regexp = "(^$|^[-0-9]{9,20}$)", message = "{tps.member.error.pattern.mobilePhone}")
    private String mobilePhone = "";

    /**
     * 회사전화
     */
    @ApiModelProperty("회사전화")
    @Builder.Default
    @Pattern(regexp = "(^$|^[-0-9]{9,20}$)", message = "{tps.member.error.pattern.companyPhone}")
    private String companyPhone = "";

    /**
     * 이메일
     */
    @ApiModelProperty("이메일")
    @Builder.Default
    @Pattern(regexp = "^[-a-zA-Z0-9_.@]{0,100}$", message = "{tps.member.error.pattern.email}")
    private String email = "";

    /**
     * 문자인증번호
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private String smsAuth = "";

    /**
     * 문자인증만료일시
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    private Date smsExp;

    /**
     * 사이트 일련번호(TB_CMS_SITE.SITE_SEQ)
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private Integer siteSeq = 0;

    /**
     * 마지막로그인일시
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    private Date lastLoginDt;

    /**
     * 마지막로그인IP주소
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private String lastLoginIp = "";

    /**
     * 비밀번호 오류횟수
     */
    @ApiModelProperty("비밀번호 오류횟수")
    @Min(value = 0, message = "{tps.member.error.min.errCnt}")
    @Builder.Default
    private Integer errCnt = 0;

    /**
     * 계정만료일
     */
    @ApiModelProperty("계정만료일")
    @DTODateTimeFormat
    private Date expireDt;

    /**
     * 비고
     */
    @ApiModelProperty("비고")
    @Builder.Default
    private String remark = "";

    /**
     * 그룹 코드 목록
     */
    @ApiModelProperty(hidden = true)
    private List<MemberGroupSaveDTO> memberGroups;

    @ApiModelProperty(hidden = true)
    private List<GroupMemberSimpleDTO> groupMembers;

    //private Set<GroupMemberSimpleDTO> groupMembers;

    /**
     * 등록일시
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 비밀번호 수정일시
     */
    @ApiModelProperty("비밀번호 수정일시")
    @DTODateTimeFormat
    private Date passwordModDt;
}
