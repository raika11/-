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
import jmnet.moka.core.tps.common.code.LinkTargetCode;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizRelationTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈관련정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_QUIZ_REL")
public class QuizRel implements Serializable {

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
     * 관련타입(A:기사, Q:퀴즈)
     */
    @Column(name = "REL_TYPE", nullable = false)
    @Builder.Default
    private QuizRelationTypeCode relType = QuizRelationTypeCode.A;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 관련콘텐트ID(서비스기사아이디 또는 퀴즈일련번호)
     */
    @Column(name = "CONTENT_ID")
    private String contentId;

    /**
     * 링크URL
     */
    @Column(name = "LINK_URL")
    private String linkUrl;

    /**
     * 링크URL Target
     */
    @Column(name = "LINK_TARGET")
    @Enumerated(EnumType.STRING)
    private LinkTargetCode linkTarget;

    /**
     * 제목
     */
    @Column(name = "TITLE", nullable = false)
    private String title;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "QUIZ_SEQ", referencedColumnName = "QUIZ_SEQ", nullable = false, insertable = false, updatable = false)
    private Quiz quiz;

}
