package jmnet.moka.core.tps.mvc.schedule.server.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 작업 엔티티 2021. 2. 1. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_CONTENT")
public class JobContent extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 작업 번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JOB_SEQ", nullable = false)
    private Long jobSeq;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN", columnDefinition = "char")
    private String usedYn;

    /**
     * 삭제여부(Y:삭제, N:미삭제)
     */
    @Column(name = "DEL_YN", columnDefinition = "char")
    private String delYn = MokaConstants.NO;

    /**
     * 카테고리
     */
    @Column(name = "CATEGORY", nullable = false)
    private String category;

    /**
     * 패키지 명
     */
    @Column(name = "PKG_NM")
    private String pkgNm;

    /**
     * 작업 타입
     */
    @Column(name = "JOB_TYPE")
    private String jobType;

    /**
     * 작업 코드
     */
    @Column(name = "JOB_CD")
    private String jobCd;

    /**
     * 작업 명
     */
    @Column(name = "JOB_NM")
    private String jobNm;

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
     * 저장경로
     */
    @Column(name = "TARGET_PATH")
    private String targetPath;

    /**
     * 저장파일 명
     */
    @Column(name = "TARGET_FILE_NAME")
    private String targetFileName;

    /**
     * 설명
     */
    @Column(name = "JOB_DESC")
    private String jobDesc;

    /**
     * 패키지 옵션(파라미터)
     */
    @Column(name = "PKG_OPT")
    private String pkgOpt;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "JOB_SEQ", insertable = false, updatable = false)
    private JobStatus jobStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "MOD_ID", insertable = false, updatable = false)
    private MemberSimpleInfo modMember;

}