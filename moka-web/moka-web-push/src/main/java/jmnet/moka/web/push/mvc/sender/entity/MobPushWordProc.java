package jmnet.moka.web.push.mvc.sender.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 푸시전송상태
 */
@Table(name = "TB_MOB_PUSH_WORD_PROC")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class MobPushWordProc implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @EmbeddedId
    private MobPushWordProcPK id;

    /**
     * 전송상태(0:전송 전, 1:전송 완료, 2:서버오류, 3:토큰 오류, 4:전송 오류, 5:타임 오버, 9:전송 중)
     */
    @Column(name = "STATUS_FLAG", nullable = false)
    private String statusFlag = "0";

    /**
     * 대상 디바이스 건수
     */
    @Column(name = "TARGET_CNT", nullable = false)
    private Integer targetCnt = 0;

    /**
     * 발송건수
     */
    @Column(name = "SEND_CNT", nullable = false)
    private Integer sendCnt = 0;

    /**
     * 수신건수
     */
    @Column(name = "RCV_CNT", nullable = false)
    private Integer rcvCnt = 0;

    /**
     * 오픈건수
     */
    @Column(name = "OPEN_CNT", nullable = false)
    private Integer openCnt = 0;

    /**
     * 시작일시
     */
    @Column(name = "START_DT")
    private Date startDt;

    /**
     * 종료일시
     */
    @Column(name = "END_DT")
    private Date endDt;


    /**
     * 종료일시
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORD_SEQ", referencedColumnName = "WORD_SEQ", insertable = false, updatable = false)
    private MobPushWord pushWord;

}
