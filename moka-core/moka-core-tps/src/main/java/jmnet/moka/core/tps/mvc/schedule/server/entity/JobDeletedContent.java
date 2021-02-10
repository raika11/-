package jmnet.moka.core.tps.mvc.schedule.server.entity;

import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 삭제된 작업 엔티티
 * 2021. 2. 2. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_DEL_CONTENT")
public class JobDeletedContent implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련 번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 작업 번호
     */
    @Column(name = "JOB_SEQ", nullable = false)
    private Long jobSeq;

    /**
     * 서버 번호
     */
    @Column(name = "SERVER_SEQ", nullable = false)
    private Long serverSeq;

    /**
     * 주기
     */
    @Column(name = "PERIOD", nullable = false)
    private Long period;

    /**
     * 전송타입
     */
    @Column(name = "SEND_TYPE")
    private String sendType;

    /**
     * FTP포트
     */
    @Column(name = "FTP_PORT")
    private Long ftpPort;

    /**
     * FTP PASSIVE 여부
     */
    @Column(name = "FTP_PASSIVE", columnDefinition = "char")
    private String ftpPassive;

    /**
     * 카테고리
     */
    @Column(name = "CATEGORY", nullable = false)
    private String category;

    /**
     * 서버 IP
     */
    @Column(name = "SERVER_IP", nullable = false)
    private String serverIp;

    /**
     * 배포경로
     */
    @Column(name = "TARGET_PATH")
    private String targetPath;

    /**
     * URL
     */
    @Column(name = "CALL_URL")
    private String callUrl;

    /**
     * 설명
     */
    @Column(name = "JOB_DESC")
    private String jobDesc;

    /**
     * 등록자ID
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name="REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;
}
