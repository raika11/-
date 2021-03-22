package jmnet.moka.core.tps.mvc.member.entity;

import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * CMS 사용자
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_MEM")
public class MemberInfo extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 사용자ID
     */
    @Id
    @Column(name = "MEM_ID", nullable = false)
    private String memberId;

    /**
     * 비고
     */
    @Column(name = "PWD")
    @Builder.Default
    private String password = "";

    /**
     * 사용자명
     */
    @Column(name = "MEM_NM", nullable = false)
    private String memberNm;

    /**
     * 상태(유효/정지)
     */
    @Column(name = "STATUS", nullable = false)
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private MemberStatusCode status = MemberStatusCode.Y;

    /**
     * J중앙I일간E기타M매거진A관리자D청백R기사수신
     */
    @Column(name = "GRP")
    @Builder.Default
    private String group = "J";

    /**
     * 부서
     */
    @Column(name = "DEPT")
    @Builder.Default
    private String dept = "";

    /**
     * 핸드폰번호
     */
    @Column(name = "MOBILE_PHONE")
    @Builder.Default
    private String mobilePhone = "";

    /**
     * 회사전화
     */
    @Column(name = "COM_PHONE")
    @Builder.Default
    private String companyPhone = "";

    /**
     * 이메일
     */
    @Column(name = "EMAIL")
    @Builder.Default
    private String email = "";

    /**
     * 문자인증번호
     */
    @Column(name = "SMS_AUTH")
    @Builder.Default
    private String smsAuth = "";

    /**
     * 문자인증만료일시
     */
    @Column(name = "SMS_EXP")
    private Date smsExp;

    /**
     * 사이트 일련번호(TB_CMS_SITE.SITE_SEQ)
     */
    @Column(name = "SITE_SEQ")
    @Builder.Default
    private Integer siteSeq = 0;

    /**
     * 마지막로그인일시
     */
    @Column(name = "LAST_LOGIN_DT")
    private Date lastLoginDt;

    /**
     * 마지막로그인IP주소
     */
    @Column(name = "LAST_LOGIN_IP")
    @Builder.Default
    private String lastLoginIp = "";

    /**
     * 비밀번호 오류횟수
     */
    @Column(name = "ERR_CNT")
    @Builder.Default
    private Integer errCnt = 0;

    /**
     * 계정만료일
     */
    @Column(name = "EXPIRE_DT")
    private Date expireDt;

    /**
     * 비밀번호 수정일시
     */
    @Column(name = "PWD_MOD_DT")
    private Date passwordModDt;

    /**
     * 비고
     */
    @Column(name = "BIGO")
    @Builder.Default
    private String remark = "";

    @Transient
    private List<GroupMember> groupMembers;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberInfo regMember;

}
