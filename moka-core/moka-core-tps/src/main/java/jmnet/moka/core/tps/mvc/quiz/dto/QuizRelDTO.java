package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
public class QuizRelDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<QuizRelDTO>>() {
    }.getType();

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
     * 관련타입(A:기사, Q:퀴즈)
     */
    @ApiModelProperty(value = "관련타입(A:기사, Q:퀴즈)")
    @Builder.Default
    @NotNull(message = "{tps.quiz-relation.error.pattern.relType}")
    private QuizRelationTypeCode relType = QuizRelationTypeCode.A;

    /**
     * 순서
     */
    @ApiModelProperty(value = "순서", hidden = true)
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 관련콘텐트ID(서비스기사아이디 또는 퀴즈일련번호)
     */
    @ApiModelProperty(value = "관련콘텐트ID")
    @Size(max = 20, message = "{tps.quiz-relation.error.size.contentId}")
    private String contentId;

    /**
     * 링크URL
     */
    @ApiModelProperty(value = "링크URL")
    @Size(max = 200, message = "{tps.quiz-relation.error.size.linkUrl}")
    private String linkUrl;

    /**
     * 링크URL Target
     */
    @ApiModelProperty(value = "관련정보 링크URL Target")
    @Builder.Default
    private LinkTargetCode linkTarget = LinkTargetCode.S;

    /**
     * 제목
     */
    @ApiModelProperty(value = "제목")
    @NotEmpty(message = "{tps.quiz-relation.error.notempty.title}")
    @Size(max = 510, message = "{tps.quiz-relation.error.size.title}")
    private String title;

}
