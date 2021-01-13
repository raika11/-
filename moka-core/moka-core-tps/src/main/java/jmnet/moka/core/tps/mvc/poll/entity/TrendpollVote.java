package jmnet.moka.core.tps.mvc.poll.entity;

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
 * 투표응모현황
 */
@Entity
@Table(name = "TB_TRENDPOLL_VOTE")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TrendpollVote implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 투표일련번호
     */
    @Column(name = "POLL_SEQ", nullable = false)
    private Long pollSeq;

    /**
     * 항목일련번호
     */
    @Column(name = "ITEM_SEQ", nullable = false)
    private Long itemSeq;

    /**
     * 디바이스 구분(P:PC, M:MOBILE)
     */
    @Column(name = "DEV_DIV")
    private String devDiv = "P";

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 등록IP주소
     */
    @Column(name = "REG_IP")
    private String regIp;

    /**
     * 로그인SITE(소셜로그인경로포함)
     */
    @Column(name = "LOGIN_SITE")
    private String loginSite;

    /**
     * 회원ID
     */
    @Column(name = "MEM_ID")
    private String memId;

    /**
     * PC_ID
     */
    @Column(name = "PC_ID")
    private String pcId;

}
