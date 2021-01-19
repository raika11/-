package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizQuestionTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * 퀴즈문항
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class QuestionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<QuestionDTO>>() {
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
     * 보기개수
     */
    @ApiModelProperty(value = "보기개수")
    @Builder.Default
    @Min(value = 1, message = "{tps.quiz-question.error.min.choiceCnt}")
    private Integer choiceCnt = 1;

    /**
     * 이미지URL
     */
    @ApiModelProperty(value = "이미지URL")
    @Size(max = 200, message = "{tps.quiz-question.error.size.imgUrl}")
    private String imgUrl;

    /**
     * 문항제목
     */
    @ApiModelProperty(value = "문항제목")
    @Size(max = 100, message = "{tps.quiz-question.error.size.title}")
    private String title;

    /**
     * 문항설명
     */
    @ApiModelProperty(value = "문항설명")
    @Size(max = 100, message = "{tps.quiz-question.error.size.questionDesc}")
    private String questionDesc;

    /**
     * 정답
     */
    @ApiModelProperty(value = "정답")
    @Size(max = 50, message = "{tps.quiz-question.error.size.answer}")
    private String answer;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile imgFile;

    /**
     * 선택 항목
     */
    @Builder.Default
    @ApiModelProperty(value = "선택 항목")
    private List<@Valid QuizChoiceDTO> choices = new ArrayList<>();
}
