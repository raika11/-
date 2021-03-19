package jmnet.moka.web.schedule.mvc.gen.entity;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * job 정보
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.gen.entity
 * ClassName : GenContent
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 12:00
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_CONTENT")
public class GenContent {

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
    private String delYn;

    /**
     * 서버 번호
     */
    @Column(name = "SERVER_SEQ", nullable = false)
    private Long serverSeq;

    /**
     * 카테고리
     */
    @Column(name = "CATEGORY", nullable = false)
    private String category;

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
     * 작업경로
     */
    @Column(name = "TARGET_PATH")
    private String targetPath;

    /**
     * 작업파일 명
     */
    @Column(name = "TARGET_FILE_NAME")
    private String targetFileName;

    /**
     * 설명
     */
    @Column(name = "JOB_DESC")
    private String jobDesc;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOB_SEQ", insertable = false, updatable = false)
    private GenStatus genStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SERVER_SEQ", insertable = false, updatable = false)
    private GenTarget genTarget;

    /**
     * 작업 패키지+서비스 명
     */
    @Column(name = "PKG_NM")
    //@Transient
    private String programeNm;

    /**
     * JOB_TYPE
     */
    @Column(name = "JOB_TYPE")
    private String jobType;

    /**
     * JOB_CD
     */
    @Column(name = "JOB_CD")
    private String jobCd;

    /**
     * PKG_OPT
     */
    @Column(name = "PKG_OPT")
    private String pkgOpt;

}
