package jmnet.moka.core.tps.mvc.member.entity;

import java.io.Serializable;
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
 * CMS 로그인 로그
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_LOGIN_LOG")
public class LoginLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * IP주소
     */
    @Column(name = "IP")
    private String ip;

    /**
     * 사용자ID
     */
    @Column(name = "MEM_ID")
    private String memId;

    /**
     * 성공여부
     */
    @Column(name = "SUCCESS_YN")
    private String successYn;

    /**
     * 에러코드
     */
    @Column(name = "ERR_CD")
    private String errCd;

    /**
     * 에러메시지
     */
    @Column(name = "ERR_MSG")
    private String errMsg;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", updatable = false)
    @Builder.Default
    protected Date regDt = new Date();

}
