package jmnet.moka.core.tps.mvc.quiz.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.code.DeviceTypeCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈응모현황
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class QuizVoteDTO implements Serializable {

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
     * 디바이스 구분(P:PC, M:MOBILE)
     */
    @ApiModelProperty(value = "디바이스 구분(P:PC, M:MOBILE)")
    private DeviceTypeCode devDiv = DeviceTypeCode.M;

    /**
     * 등록IP주소
     */
    @ApiModelProperty(value = "등록IP주소", hidden = true)
    private String regIp;

    /**
     * 회원ID
     */
    @ApiModelProperty(value = "회원ID")
    @Size(max = 30, message = "{tps.quiz-vote.error.size.memId}")
    private String memId;

    /**
     * 로그인SITE(소셜로그인경로포함)
     */
    @ApiModelProperty(value = "로그인SITE(소셜로그인경로포함)")
    @Size(max = 10, message = "{tps.quiz-vote.error.size.loginSite}")
    private String loginSite;

    /**
     * PC아이디
     */
    @ApiModelProperty(value = "PC아이디")
    @Size(max = 100, message = "{tps.quiz-vote.error.size.pcId}")
    private String pcId;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    private Date regDt;

}
