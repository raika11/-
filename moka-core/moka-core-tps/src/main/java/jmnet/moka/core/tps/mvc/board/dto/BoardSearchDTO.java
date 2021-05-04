package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.dto
 * ClassName : BoardInfoDTO
 * Created : 2020-12-16 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-16 16:05
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시물 검색 DTO")
public class BoardSearchDTO extends SearchDTO {


    @ApiModelProperty("시작일시 검색")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty("종료일시 검색")
    @DTODateTimeFormat
    private Date endDt;

    @ApiModelProperty("삭제여부")
    private String delYn;

    /**
     * 말머리1
     */
    @ApiModelProperty("말머리1")
    @Max(value = 20, message = "{tps.board.error.size.titlePrefix1}")
    private String titlePrefix1;

    /**
     * 말머리1
     */
    @ApiModelProperty("말머리2")
    @Max(value = 20, message = "{tps.board.error.size.titlePrefix2}")
    private String titlePrefix2;

    /**
     * 채널ID(예:JPOD 채널SEQ)
     */
    @ApiModelProperty("채널ID(예:JPOD 채널SEQ)")
    @Min(value = 0, message = "{tps.board.error.min.channelId}")
    private Long channelId = 0l;

    @ApiModelProperty("상위 게시글 일련번호")
    private Long parentBoardSeq;

    /**
     * 팟티채널SRL
     */
    @ApiModelProperty(value = "팟티채널SRL", hidden = true)
    @Builder.Default
    private Integer podtyChnlSrl = 0;

    /**
     * 팟티채널SRL
     */
    @ApiModelProperty(value = "j팟", hidden = true)
    @Builder.Default
    private Integer channelUsedYn = 0;

    @ApiModelProperty("답글등록여부")
    private String answYn;
}
