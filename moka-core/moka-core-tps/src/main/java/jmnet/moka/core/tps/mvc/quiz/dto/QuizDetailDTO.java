package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.web.multipart.MultipartFile;

/**
 * 퀴즈
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@ApiModel("퀴즈상세정보")
public class QuizDetailDTO extends QuizDTO {

    @Builder.Default
    @ApiModelProperty(value = "문항 목록")
    private List<@Valid QuestionDTO> questions = new ArrayList<>();

    @Builder.Default
    @ApiModelProperty(value = "관련 자료 목록")
    private List<@Valid QuizRelDTO> quizRels = new ArrayList<>();

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile imgFile;


}
