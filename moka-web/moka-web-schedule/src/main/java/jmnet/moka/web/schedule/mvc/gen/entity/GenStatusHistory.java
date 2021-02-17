package jmnet.moka.web.schedule.mvc.gen.entity;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * <pre>
 * 작업 결과 entity
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.gen.entity
 * ClassName : GenStatusHistory
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 12:00
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_GEN_CONTENT_HIST")
public class GenStatusHistory {

    /**
     * 이력 일련번호
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
     * 0 실행전, 1 완료, 9 실행중, 2~8 에러 번호
     */
    @Column(name = "STATUS_FLAG", nullable = false)
    private String status;

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN")
    private String delYn;

    /**
     * 예약 일시
     */
    @Column(name = "RESERVE_DT")
    private Date reserveDt;

    /**
     * 시작 일시
     */
    @Column(name = "START_DT")
    private Date startDt;

    /**
     * 종료 일시
     */
    @Column(name = "END_DT")
    private Date endDt;

    /**
     * 설명
     */
    @Column(name = "PARAM_DESC")
    private String paramDesc;
}
