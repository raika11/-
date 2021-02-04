package jmnet.moka.core.tps.mvc.schedule.server.entity;

import lombok.*;

import javax.persistence.*;

/**
 * 작업 실행상태 엔티티
 * 2021. 2. 3. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_CONTENT")
public class JobStatistic {

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


    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name="SERVER_SEQ", insertable = false, updatable = false)
    private DistributeServerSimple distributeServerSimple;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name="JOB_SEQ", insertable = false, updatable = false)
    private JobStatus jobStatus;
}
