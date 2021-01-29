package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈문항 보기목록
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@JsonInclude(Include.NON_NULL)
public class QuizChoiceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

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
     * 보기제목
     */
    @ApiModelProperty(value = "보기제목")
    @NotEmpty(message = "{tps.quiz-choice.error.notempty.title}")
    @Size(max = 20, message = "{tps.quiz-choice.error.size.title}")
    private String title;

    /**
     * 정답여부
     */
    @ApiModelProperty(value = "정답여부")
    @Builder.Default
    @Pattern(regexp = "^[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
    private String answYn = MokaConstants.NO;

}
