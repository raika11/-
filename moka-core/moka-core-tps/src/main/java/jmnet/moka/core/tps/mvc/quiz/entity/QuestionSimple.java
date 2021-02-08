package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizQuestionTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈문항
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_QUESTION")
public class QuestionSimple implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 문항일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QUESTION_SEQ", nullable = false)
    private Long questionSeq;

    /**
     * 문항유형 - O(객관식)/S(주관식)
     */
    @Column(name = "QUESTION_TYPE", nullable = false)
    @Builder.Default
    @Enumerated(value = EnumType.STRING)
    private QuizQuestionTypeCode questionType = QuizQuestionTypeCode.O;

    /**
     * 문항제목
     */
    @Column(name = "TITLE")
    private String title;



}
