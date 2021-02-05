package jmnet.moka.core.tps.mvc.poll.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollDivCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.dto
 * ClassName : TrendpollSearchDTO
 * Created : 2021-01-12 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-12 15:45
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("투표검색")
public class TrendpollSearchDTO extends SearchDTO {

    @ApiModelProperty("투표그룹")
    private String pollGroup;

    @ApiModelProperty("투표분류")
    private String pollCategory;

    @ApiModelProperty("투표구분 일반:W,비교:V")
    private PollDivCode pollDiv;

    @ApiModelProperty("레이아웃 T:텍스트,M:테스트+이미지,P:이미지")
    private PollTypeCode pollType;

    @ApiModelProperty("상태 S:서비스,D:삭제,T:일시중지")
    private PollStatusCode[] status;

    @DTODateTimeFormat
    private Date startDt;

    @DTODateTimeFormat
    private Date endDt;


}
