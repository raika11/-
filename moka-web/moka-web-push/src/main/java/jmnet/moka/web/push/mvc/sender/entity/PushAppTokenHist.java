package jmnet.moka.web.push.mvc.sender.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 푸시 앱 토큰 이력 정보
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_PUSH_APP_TOKEN_HIST")
public class PushAppTokenHist implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 이력 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HIST_SEQ", nullable = false)
    private Long histSeq;

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
     * 푸시 카운트
     */
    @Column(name = "BADGE")
    private Long badge;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 입력일시
     */
    @Column(name = "INS_DT")
    private Date insDt;

    /**
     * 회원 아이디
     */
    @Column(name = "MEM_ID")
    private String memId;

    /**
     * 푸시 토큰
     */
    @Column(name = "TOKEN")
    private String token;

}
