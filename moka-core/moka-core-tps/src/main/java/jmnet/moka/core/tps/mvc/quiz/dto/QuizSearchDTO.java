package jmnet.moka.core.tps.mvc.quiz.dto;

import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import jmnet.moka.common.data.support.SearchDTO;
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

/**
 * 퀴즈 검색 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class QuizSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;


    /**
     * 퀴즈상태 - Y(서비스)/N(종료)/P(일시중지)
     */
    @ApiModelProperty(value = "퀴즈상태 - Y(서비스)/N(종료)/P(일시중지)")
    @Enumerated(value = EnumType.STRING)
    private QuizStatusCode quizSts;

    /**
     * 퀴즈유형 - AA(전체노출전체정답)/AS(전체노출퀴즈별정답)/SA(1건노출전체정답)/SS(1건노출퀴즈별정답)
     */
    @ApiModelProperty(value = "퀴즈유형 - AA(전체노출전체정답)/AS(전체노출퀴즈별정답)/SA(1건노출전체정답)/SS(1건노출퀴즈별정답)")
    private QuizTypeCode quizType;

    /**
     * 로그인여부
     */
    @ApiModelProperty(value = "로그인여부")
    @Builder.Default
    private String loginYn = MokaConstants.NO;

    /**
     * 댓글여부
     */
    @ApiModelProperty(value = "댓글여부")
    @Builder.Default
    private String replyYn = MokaConstants.NO;

    /**
     * 삭제여부
     */
    @ApiModelProperty(value = "삭제여부")
    @Builder.Default
    private String delYn = MokaConstants.NO;

    /**
     * 제목
     */
    @ApiModelProperty(value = "제목")
    private String title;

    /**
     * 퀴즈설명
     */
    @ApiModelProperty(value = "퀴즈설명")
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
