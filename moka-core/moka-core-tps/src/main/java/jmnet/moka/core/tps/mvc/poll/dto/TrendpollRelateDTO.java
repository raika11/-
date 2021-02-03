package jmnet.moka.core.tps.mvc.poll.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import jmnet.moka.common.data.support.EnumValid;
import jmnet.moka.core.tps.common.code.LinkTargetCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollRelateTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 투표관련정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("투표 관련정보")
public class TrendpollRelateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @ApiModelProperty(value = "관련정보 일련번호")
    private Long seqNo;

    /**
     * 투표일련번호
     */
    @ApiModelProperty(value = "투표일련번호", hidden = true)
    private Long pollSeq;

    /**
     * 관련타입(A:기사 P:투표)
     */
    @ApiModelProperty(value = "관련타입(A:기사 P:투표)")
    @Builder.Default
    private PollRelateTypeCode relType = PollRelateTypeCode.A;

    /**
     * 순서
     */
    @ApiModelProperty(value = "관련정보 순서")
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 관련콘텐트ID(투표일련번호 등)
     */
    @ApiModelProperty(value = "관련콘텐트ID(투표일련번호 등)")
    private String contentId;

    /**
     * 이미지경로
     */
    @ApiModelProperty(value = "이미지URL")
    private String imgUrl;


    /**
     * 링크URL
     */
    @ApiModelProperty(value = "관련정보 링크URL")
    private String linkUrl;

    /**
     * 링크URL Target
     */
    @ApiModelProperty(value = "관련정보 링크URL Target")
    @Builder.Default
    @EnumValid(message = "{tps.common.error.size.linkTarget}", enumClass = LinkTargetCode.class)
    private LinkTargetCode linkTarget = LinkTargetCode.S;

    /**
     * 제목
     */
    @ApiModelProperty(value = "관련정보 제목")
    private String title;
}
