package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
public class Question implements Serializable {

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
     * 보기개수
     */
    @Column(name = "CHOICE_CNT", nullable = false)
    @Builder.Default
    private Integer choiceCnt = 1;

    /**
     * 이미지URL
     */
    @Column(name = "IMG_URL")
    private String imgUrl;

    /**
     * 문항제목
     */
    @Column(name = "TITLE")
    private String title;

    /**
     * 문항설명
     */
    @Column(name = "QUESTION_DESC")
    private String questionDesc;

    /**
     * 정답
     */
    @Column(name = "ANSW")
    private String answer;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "question", cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    private List<QuizChoice> choices = new ArrayList<>();


}
