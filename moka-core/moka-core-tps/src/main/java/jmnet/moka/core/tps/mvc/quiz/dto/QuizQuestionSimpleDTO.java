package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
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
public class QuizQuestionSimpleDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<QuizQuestionSimpleDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @ApiModelProperty(value = "일련번호", hidden = true)
    private Long seqNo;

    /**
     * 퀴즈일련번호
     */
    @ApiModelProperty(value = "퀴즈일련번호", hidden = true)
    private Long quizSeq;

    /**
     * 문항일련번호
     */
    @ApiModelProperty(value = "문항일련번호", hidden = true)
    private Long questionSeq;

    /**
     * 순서
     */
    @ApiModelProperty(value = "순서", hidden = true)
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 퀴즈정보
     */
    @ApiModelProperty(value = "퀴즈정보", hidden = true)
    private QuizSimpleDTO quiz;

    /**
     * 질문정보
     */
    @ApiModelProperty(value = "질문정보", hidden = true)
    private QuestionSimpleDTO question;

}
