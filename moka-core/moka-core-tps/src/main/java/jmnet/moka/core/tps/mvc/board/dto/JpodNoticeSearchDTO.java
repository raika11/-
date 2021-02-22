package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Min;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
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
 * ClassName : JpodNoticeSearchDTO
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
@ApiModel("Jpod 공지사항 검색 DTO")
public class JpodNoticeSearchDTO extends SearchDTO {


    @ApiModelProperty("시작일시 검색")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty("종료일시 검색")
    @DTODateTimeFormat
    private Date endDt;

    @ApiModelProperty("삭제여부")
    @Builder.Default
    private String delYn = MokaConstants.YES;

    /**
     * j팟 채널ID
     */
    @ApiModelProperty("j팟 채널ID")
    @Min(value = 0, message = "{tps.jpod-channel.error.min.channelId}")
    private Long channelId;
}
