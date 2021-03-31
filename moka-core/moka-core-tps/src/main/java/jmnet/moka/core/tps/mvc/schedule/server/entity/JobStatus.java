package jmnet.moka.core.tps.mvc.schedule.server.entity;


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
 * 작업 상태 엔티티 2021. 2. 1. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_STATUS")
public class JobStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 작업 번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JOB_SEQ", nullable = false)
    private Long jobSeq;

    /**
     * 생성 결과
     */
    @Column(name = "GEN_RESULT", nullable = false)
    private Long genResult;

    /**
     * 생성 실행 횟수
     */
    @Column(name = "GEN_EXEC_TIME", nullable = false)
    private Long genExecTime;

    /**
     * 전송 결과
     */
    @Column(name = "SEND_RESULT", nullable = false)
    private Long sendResult;

    /**
     * 전송 실행 횟수
     */
    @Column(name = "SEND_EXEC_TIME", nullable = false)
    private Long sendExecTime;

    /**
     * 최종실행 시각
     */
    @Column(name = "LAST_EXEC_DT")
    private Date lastExecDt;

    /**
     * 에러 메시지
     */
    @Column(name = "ERR_MSG")
    private String errMgs;

    /**
     * 실행 내용
     */
    @Column(name = "CONTENT")
    private String content;
}
