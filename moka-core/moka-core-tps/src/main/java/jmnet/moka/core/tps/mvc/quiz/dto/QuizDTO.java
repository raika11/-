package jmnet.moka.core.tps.mvc.quiz.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizStatusCode;
import jmnet.moka.core.tps.mvc.quiz.code.QuizCode.QuizTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * 퀴즈
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class QuizDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<QuizDTO>>() {
    }.getType();

    /**
     * 퀴즈일련번호
     */
    @ApiModelProperty(value = "퀴즈일련번호", hidden = true)
    private Long quizSeq;

    /**
     * 퀴즈상태 - Y(서비스)/N(종료)/P(일시중지)
     */
    @ApiModelProperty(value = "퀴즈상태 - Y(서비스)/N(종료)/P(일시중지)")
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    @NotNull(message = "{tps.quiz.error.notnull.quizSts}")
    private QuizStatusCode quizSts = QuizStatusCode.P;

    /**
     * 퀴즈유형 - AA(전체노출전체정답)/AS(전체노출퀴즈별정답)/SA(1건노출전체정답)/SS(1건노출퀴즈별정답)
     */
    @ApiModelProperty(value = "퀴즈유형 - AA(전체노출전체정답)/AS(전체노출퀴즈별정답)/SA(1건노출전체정답)/SS(1건노출퀴즈별정답)")
    @Builder.Default
    @NotNull(message = "{tps.quiz.error.notnull.quizType}")
    private QuizTypeCode quizType = QuizTypeCode.AA;

    /**
     * 로그인여부
     */
    @ApiModelProperty(value = "로그인여부")
    @Builder.Default
    @Pattern(regexp = "^[Y|N]$", message = "{tps.quiz.error.pattern.loginYn}")
    private String loginYn = MokaConstants.NO;

    /**
     * 댓글여부
     */
    @ApiModelProperty(value = "댓글여부")
    @Builder.Default
    @Pattern(regexp = "^[Y|N]$", message = "{tps.quiz.error.pattern.delYn}")
    private String replyYn = MokaConstants.NO;

    /**
     * 삭제여부
     */
    @ApiModelProperty(value = "삭제여부", hidden = true)
    @Builder.Default
    @Pattern(regexp = "^[Y|N]$", message = "{tps.quiz.error.pattern.delYn}")
    private String delYn = MokaConstants.NO;

    /**
     * 투표수
     */
    @ApiModelProperty(value = "투표수", hidden = true)
    @Builder.Default
    private Integer voteCnt = 0;

    /**
     * 퀴즈URL
     */
    @ApiModelProperty(value = "퀴즈URL")
    @Size(max = 200, message = "{tps.quiz.error.size.quizUrl}")
    private String quizUrl;

    /**
     * 이미지URL
     */
    @ApiModelProperty(value = "이미지URL")
    @Size(max = 200, message = "{tps.quiz.error.size.imgUrl}")
    private String imgUrl;

    /**
     * 제목
     */
    @ApiModelProperty(value = "제목")
    @NotEmpty(message = "{tps.quiz.error.notempty.title}")
    @Size(max = 510, message = "{tps.quiz.error.size.title}")
    private String title;

    /**
     * 퀴즈설명
     */
    @ApiModelProperty(value = "퀴즈설명")
    @Size(max = 1000, message = "{tps.quiz.error.size.quizDesc}")
    private String quizDesc;

    /**
     * 등록자
     */
    @ApiModelProperty(value = "등록자", hidden = true)
    private MemberSimpleDTO regMember;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    private Date regDt;
}
