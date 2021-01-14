package jmnet.moka.core.tps.mvc.poll.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
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
@ApiModel("투표 현황 검색")
public class TrendpollStatSearchDTO {

    @ApiModelProperty(value = "투표일련번호", hidden = true)
    private Long pollSeq;

    //@ApiModelProperty("상태 A:전체,D:기간별(날짜별),T:기간내 디바이스별")
    //private PollStatCode statType;

    @ApiModelProperty("검색시작일")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty("검색종료일")
    @DTODateTimeFormat
    private Date endDt;


}
