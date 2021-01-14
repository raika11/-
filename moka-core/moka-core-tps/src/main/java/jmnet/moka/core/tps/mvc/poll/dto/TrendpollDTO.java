package jmnet.moka.core.tps.mvc.poll.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollDivCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * 투표
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@ApiModel("투표정보")
public class TrendpollDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<TrendpollDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;



    /**
     * 투표일련번호
     */
    @ApiModelProperty(value = "투표 일련번호", hidden = true)
    private Long pollSeq;

    /**
     * 투표그룹
     */
    @ApiModelProperty(value = "투표 그룹")
    private String pollGroup;

    /**
     * 투표분류
     */
    @ApiModelProperty(value = "투표분류")
    private String pollCategory;

    /**
     * 투표구분(일반형:W, 비교형:V)
     */
    @ApiModelProperty(value = "투표구분(일반형:W, 비교형:V)")
    @Builder.Default
    private PollDivCode pollDiv = PollDivCode.W;

    /**
     * 레이아웃(T:TEXT, M:이미지+TEXT, P:이미지)
     */
    @ApiModelProperty(value = "레이아웃(T:TEXT, M:이미지+TEXT, P:이미지)")
    @Builder.Default
    private PollTypeCode pollType = PollTypeCode.T;

    /**
     * 항목수
     */
    @ApiModelProperty(value = "항목수", hidden = true)
    @Builder.Default
    private Integer itemCnt = 4;

    /**
     * 중복허용답변수
     */
    @ApiModelProperty(value = "중복허용답변수")
    @Builder.Default
    private Integer allowAnswCnt = 1;

    /**
     * 투표 총 응모수
     */
    @ApiModelProperty(value = "투표 총 응모수")
    private Integer voteCnt = 0;

    /**
     * 시작일시
     */
    @ApiModelProperty(value = "시작일시")
    private String startDt;

    /**
     * 종료일시
     */
    @ApiModelProperty(value = "종료일시")
    private String endDt;

    /**
     * 로그인여부
     */
    @ApiModelProperty(value = "로그인여부")
    private String loginYn = MokaConstants.NO;

    /**
     * 중복투표여부
     */
    @ApiModelProperty(value = "중복투표여부")
    private String repetitionYn = MokaConstants.NO;

    /**
     * 메인노출여부
     */
    @ApiModelProperty(value = "메인노출여부")
    private String mainYn = MokaConstants.NO;

    /**
     * 게시판여부
     */
    @ApiModelProperty(value = "게시판여부")
    private String bbsYn = MokaConstants.NO;

    /**
     * 게시판URL
     */
    @ApiModelProperty(value = "게시판URL")
    private String bbsUrl;

    /**
     * 댓글여부
     */
    @ApiModelProperty(value = "댓글여부")
    private String replyYn = MokaConstants.NO;

    /**
     * 댓글개수
     */
    @ApiModelProperty(value = "댓글개수")
    private Integer replyCnt = 0;

    /**
     * 상태 S:서비스, D:삭제, T:일시중지
     */
    @ApiModelProperty(value = "상태 S:서비스, D:삭제, T:일시중지")
    private PollStatusCode status = PollStatusCode.T;

    /**
     * 제목
     */
    @ApiModelProperty(value = "제목")
    private String title;

    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    private Date regDt;

}
