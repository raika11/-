package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("작업 검색 DTO")
public class JobContentSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentSearchDTO>>() {
    }.getType();

    @ApiModelProperty(hidden = true)
    private String delYn = MokaConstants.NO;

    @ApiModelProperty("분류(기타코드 > GEN_CATE)")
    private String category;

    @ApiModelProperty("주기(30/60/120/300/600/1200/1800/3600/43200/86400)")
    private Long period;

    @ApiModelProperty("타입(FTP/ND)")
    private String sendType;

    @ApiModelProperty("배포서버(배포서버 코드 API를 통해 조회한 serverSeq)")
    private Long serverSeq;

    @ApiModelProperty("사용여부(사용:Y/미사용:N)")
    private String usedYn;
}
