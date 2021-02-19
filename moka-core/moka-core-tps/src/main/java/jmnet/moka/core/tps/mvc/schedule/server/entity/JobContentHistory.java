package jmnet.moka.core.tps.mvc.schedule.server.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_GEN_CONTENT_HIST")
public class JobContentHistory {

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
