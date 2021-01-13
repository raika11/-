package jmnet.moka.core.tps.mvc.poll.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 투표항목
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("투표항목정보")
public class TrendpollItemDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 항목일련번호
     */
    @ApiModelProperty(value = "항목일련번호")
    private Long itemSeq;

    /**
     * 투표일련번호
     */
    @ApiModelProperty(value = "투표일련번호", hidden = true)
    private Long pollSeq;

    /**
     * 순서
     */
    @ApiModelProperty(value = "순서")
    private Integer ordNo = 1;

    /**
     * 항목별 응모수
     */
    @ApiModelProperty(value = "항목별 응모수", hidden = true)
    private Integer voteCnt = 0;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 이미지경로
     */
    @ApiModelProperty(value = "이미지경로")
    private String imgPath;

    /**
     * 이미지명
     */
    @ApiModelProperty(value = "이미지명")
    private String imgName;

    /**
     * 링크URL
     */
    @ApiModelProperty(value = "링크URL")
    private String linkUrl;

    /**
     * 제목
     */
    @ApiModelProperty(value = "제목")
    private String title;
}
