package jmnet.moka.core.tps.mvc.quiz.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
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
public class QuizQuestionDTO implements Serializable {

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

}
