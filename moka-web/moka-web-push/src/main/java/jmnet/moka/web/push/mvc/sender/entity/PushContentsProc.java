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
 * 푸시기사 정보
 */
@Entity
@Table(name = "TB_PUSH_CONTENTS_PROC")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushContentsProc implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @EmbeddedId
    private PushContentsProcPK id;

    /**
     * 전송 상태
     */
    @Column(name = "STATUS_FLAG")
    private String statusFlag;

    /**
     * 대상 디바이스 건수
     */
    @Column(name = "TARGET_CNT")
    private Long targetCnt;

    /**
     * 발송 건수
     */
    @Column(name = "SEND_CNT")
    private Long sendCnt;

    /**
     * 수신 건수
     */
    @Column(name = "RCV_CNT")
    private Long rcvCnt;

    /**
     * 오픈 건수
     */
    @Column(name = "OPEN_CNT")
    private Long openCnt;

    /**
     * 최대 발송 토큰 일련번호
     */
    @Column(name = "LAST_TOKEN_SEQ")
    private Long lastTokenSeq;

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
     * 컨텐츠 일련번호
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTENT_SEQ", referencedColumnName = "CONTENT_SEQ", insertable = false, updatable = false)
    private PushContents pushContents;
}
