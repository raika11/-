package jmnet.moka.web.push.mvc.sender.entity;

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
 * 푸시토큰정보 히스토리
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_MOB_PUSH_TOKEN_HIST")
public class MobPushTokenHist implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Integer seqNo;

    /**
     * 토큰일련번호
     */
    @Column(name = "TOKEN_SEQ", nullable = false)
    private Integer tokenSeq;

    /**
     * 앱일련번호
     */
    @Column(name = "APP_SEQ", nullable = false)
    private Integer appSeq;

    /**
     * 푸시 카운트
     */
    @Column(name = "BADGE", nullable = false)
    private Integer BADGE;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 마지막접속일시
     */
    @Column(name = "LAST_DT")
    private Date lastDt;

    /**
     * 입력일시
     */
    @Column(name = "INS_DT")
    private Date insDt;

    /**
     * 토큰
     */
    @Column(name = "TOKEN", nullable = false)
    private String TOKEN;

    /**
     * 디바이스ID
     */
    @Column(name = "DEV_ID")
    private String devId;

    /**
     * 회원ID
     */
    @Column(name = "MEM_ID")
    private String memId;

}
