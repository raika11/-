package jmnet.moka.core.tps.mvc.member.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 백오피스 사용자 SMS인증
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_MEM_SMS")
public class MemberSms {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private String seqNo;

    /**
     * 사용자ID
     */
    @Column(name = "MEM_ID")
    private String memberId;

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
     * 등록일시
     */
    @Column(name = "REG_DT", updatable = false)
    protected Date regDt;
}
