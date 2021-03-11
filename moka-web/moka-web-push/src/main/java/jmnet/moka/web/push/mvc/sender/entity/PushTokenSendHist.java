package jmnet.moka.web.push.mvc.sender.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 푸시토큰 전송이력 정보
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_PUSH_TOKEN_SEND_HIST")
public class PushTokenSendHist implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 이력 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HIST_SEQ", nullable = false)
    private Long histSeq;

    /**
     * 콘텐트 일련번호
     */
    @Column(name = "CONTENT_SEQ", nullable = false)
    private Long contentSeq;

    /**
     * 토큰 일련번호
     */
    @Column(name = "TOKEN_SEQ", nullable = false)
    private Long tokenSeq;

    /**
     *  앱 일련번호
     */
    @Column(name = "APP_SEQ")
    private int appSeq;

    /**
     * 전송여부
     */
    @Column(name = "SEND_YN")
    private String sendYn;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

}
