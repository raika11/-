package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.code.DeviceTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈응모현황
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_QUIZ_VOTE")
public class QuizVote implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 퀴즈일련번호
     */
    @Column(name = "QUIZ_SEQ", nullable = false)
    private Long quizSeq;

    /**
     * 디바이스 구분(P:PC, M:MOBILE)
     */
    @Column(name = "DEV_DIV")
    @Enumerated(value = EnumType.STRING)
    private DeviceTypeCode devDiv = DeviceTypeCode.M;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", updatable = false)
    protected Date regDt;

    /**
     * 등록IP주소
     */
    @Column(name = "REG_IP")
    private String regIp;

    /**
     * 회원ID
     */
    @Column(name = "MEM_ID")
    private String memId;

    /**
     * 회원SEQ
     */
    @Column(name = "MEM_SEQ")
    private Long memSeq;

    /**
     * 로그인SITE(소셜로그인경로포함)
     */
    @Column(name = "LOGIN_SITE")
    private String loginSite;

    /**
     * 로그인TYPE
     */
    @Column(name = "LOGIN_TYPE")
    private String loginType;

    /**
     * PC아이디
     */
    @Column(name = "PC_ID")
    private String pcId;

}
