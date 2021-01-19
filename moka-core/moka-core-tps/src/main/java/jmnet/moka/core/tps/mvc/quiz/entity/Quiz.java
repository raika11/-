package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizStatusCode;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * 퀴즈
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_QUIZ")
@EqualsAndHashCode(callSuper = true)
public class Quiz extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 퀴즈일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QUIZ_SEQ", nullable = false)
    private Long quizSeq;

    /**
     * 퀴즈상태 - Y(서비스)/N(종료)/P(일시중지)
     */
    @Column(name = "QUIZ_STS", nullable = false)
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private QuizStatusCode quizSts = QuizStatusCode.P;

    /**
     * 퀴즈유형 - AA(전체노출전체정답)/AS(전체노출퀴즈별정답)/SA(1건노출전체정답)/SS(1건노출퀴즈별정답)
     */
    @Column(name = "QUIZ_TYPE", nullable = false)
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private QuizTypeCode quizType = QuizTypeCode.AA;

    /**
     * 로그인여부
     */
    @Column(name = "LOGIN_YN", nullable = false)
    @Builder.Default
    private String loginYn = MokaConstants.NO;

    /**
     * 댓글여부
     */
    @Column(name = "REPLY_YN", nullable = false)
    @Builder.Default
    private String replyYn = MokaConstants.NO;

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN", nullable = false)
    @Builder.Default
    private String delYn = MokaConstants.NO;

    /**
     * 투표수
     */
    @Column(name = "VOTE_CNT", nullable = false)
    @Builder.Default
    private Integer voteCnt = 0;

    /**
     * 퀴즈URL
     */
    @Column(name = "QUIZ_URL")
    private String quizUrl;

    /**
     * 이미지URL
     */
    @Column(name = "IMG_URL")
    private String imgUrl;

    /**
     * 제목
     */
    @Column(name = "TITLE", nullable = false)
    private String title;

    /**
     * 퀴즈설명
     */
    @Column(name = "QUIZ_DESC")
    private String quizDesc;


    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberInfo regMember;

}
