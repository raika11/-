package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.*;

import java.lang.reflect.Type;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("작업 실행통계 검색 DTO")
public class JobStatisticSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobStatisticSearchDTO>>() {
    }.getType();

    @ApiModelProperty("분류")
    private String category;

    @ApiModelProperty("주기")
    private Long period;

    @ApiModelProperty("타입")
    private String sendType;

    @ApiModelProperty(hidden = true)
    private Long serverSeq;

    @ApiModelProperty("상태(성공실패)")
    private Long genResult ;
}
