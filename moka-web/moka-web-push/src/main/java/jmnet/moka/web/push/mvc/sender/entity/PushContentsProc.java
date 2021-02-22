package jmnet.moka.web.push.mvc.sender.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

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
     * 콘텐트 일련번호
     */
    @Id
    @Column(name = "CONTENT_SEQ", nullable = false)
    private Long contentSeq;

    /**
     *  앱 일련번호
     */
    @Column(name = "APP_SEQ")
    private Long appSeq;

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
}
