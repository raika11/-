package jmnet.moka.core.tps.mvc.jpod.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * JPOD 공유현황
 */
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "TB_JPOD_LOGS")
public class JpodLogs extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 로그일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOG_SEQ", nullable = false)
    private Long logSeq;

    /**
     * V:노출, P:재생, L:좋아요, R:댓글, S:공유, B:구독
     */
    @Column(name = "LOG_DIV", nullable = false)
    private String logDiv = "Y";

    /**
     * 채널 SEQ
     */
    @Column(name = "CHNL_SEQ", nullable = false)
    private Integer chnlSeq;

    /**
     * 에피소드 SEQ
     */
    @Column(name = "EPSD_SEQ", nullable = false)
    private Integer epsdSeq;

    /**
     * P:PC I:IOS A:Android
     */
    @Column(name = "DEV_DIV", nullable = false)
    private String devDiv;

    /**
     * 공유사이트 (예 => 1:페북, 2:트위터, 5:카카오스토리, 6:카카오톡, 7:핀터레스트, 9:이메일 )
     */
    @Column(name = "SHR_SITE")
    private String shrSite;

    /**
     * PC_ID
     */
    @Column(name = "PC_ID")
    private String pcId;

    /**
     * 로그인 구분(X:미로그인, 0:조인스, 1:페북, 2:트위터)
     */
    @Column(name = "LOGIN_DIV")
    private String loginDiv;

    /**
     * 조인스아이디
     */
    @Column(name = "JOINS_ID")
    private String joinsId;

    /**
     * 등록IP
     */
    @Column(name = "REG_IP", nullable = false)
    private String regIp;

    /**
     * 재생시간
     */
    @Column(name = "PLAY_TIME")
    private Integer playTime;

}
