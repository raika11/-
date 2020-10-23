package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import javax.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MemberDTO {
    /**
     * 사용자ID
     */

    private String memberId;

    /**
     * 사용자명
     */
    private String memberNm;

    /**
     * 상태(유효/정지)
     */
    @Builder.Default
    private String status = "N";

    /**
     * 부서
     */
    @Builder.Default
    private String dept = "";

    /**
     * 핸드폰번호
     */
    @Builder.Default
    private String mobilePhone = "";

    /**
     * 회사전화
     */
    @Builder.Default
    private String companyPhone = "";

    /**
     * 이메일
     */
    @Builder.Default
    private String email = "";

    /**
     * 문자인증번호
     */
    @Builder.Default
    private String smsAuth = "";

    /**
     * 문자인증만료일시
     */
    private Date smsExp;

    /**
     * 사이트 일련번호(TB_CMS_SITE.SITE_SEQ)
     */
    @Builder.Default
    private Integer siteSeq = 0;

    /**
     * 마지막로그인일시
     */
    private Date lastLoginDt;

    /**
     * 마지막로그인IP주소
     */
    @Builder.Default
    private String lastLoginIp = "";

    /**
     * 비밀번호 오류횟수
     */
    @Min(value = 0, message = "{tps.member.error.min.errCnt}")
    @Builder.Default
    private Integer errCnt = 0;

    /**
     * 계정만료일
     */
    private Date expireDt;

    /**
     * 비고
     */
    @Builder.Default
    private String remark = "";
}
