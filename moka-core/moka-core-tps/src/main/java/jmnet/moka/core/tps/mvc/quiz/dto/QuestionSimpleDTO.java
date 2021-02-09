package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
public class QuestionSimpleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<QuestionSimpleDTO>>() {
    }.getType();

    /**
     * 문항일련번호
     */
    @ApiModelProperty(value = "문항일련번호")
    private Long questionSeq;

    /**
     * 문항유형 - O(객관식)/S(주관식)
     */
    @ApiModelProperty(value = "문항유형 - O(객관식)/S(주관식)")
    @Builder.Default
    @NotNull(message = "{tps.quiz-question.error.notnull.questionType}")
    private QuizQuestionTypeCode questionType = QuizQuestionTypeCode.O;


    /**
     * 문항제목
     */
    @ApiModelProperty(value = "문항제목")
    @Size(max = 100, message = "{tps.quiz-question.error.size.title}")
    private String title;

}
