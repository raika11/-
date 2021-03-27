package jmnet.moka.web.schedule.mvc.gen.entity;


import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * job 상태 entity
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.gen.entity
 * ClassName : GenStatus
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
@Table(name = "TB_GEN_STATUS")
public class GenStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 작업 번호
     */
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)   //자동생성값이 아니어서 삭제
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
     * 작업 실행 내용
     */
    @Column(name = "CONTENT")
    private String content;
}
