package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈 - 문항 매핑
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_QUIZ_QUESTION")
public class QuizQuestion implements Serializable {

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
     * 문항일련번호
     */
    @Column(name = "QUESTION_SEQ", nullable = false)
    private Long questionSeq;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "QUIZ_SEQ", referencedColumnName = "QUIZ_SEQ", nullable = false, insertable = false, updatable = false)
    private Quiz quiz;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "QUESTION_SEQ", referencedColumnName = "QUESTION_SEQ", nullable = false, insertable = false, updatable = false)
    private Question question;


}
