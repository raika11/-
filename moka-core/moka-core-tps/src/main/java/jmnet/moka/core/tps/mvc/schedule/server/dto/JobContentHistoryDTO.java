package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
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
@ApiModel("작업예약 DTO")
public class JobContentHistoryDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentHistoryDTO>>() {
    }.getType();

    @ApiModelProperty("일련 번호")
    private Long seqNo;

    @ApiModelProperty("작업 번호")
    private Long jobSeq;

    @ApiModelProperty("상태 코드")
    private String status;

    @ApiModelProperty("삭제 여부")
    private String delYn;

    @ApiModelProperty("예약일시")
    private Date reserveDt;

    @ApiModelProperty("시작일시")
    private Date startDt;

    @ApiModelProperty("종료일시")
    private Date endDt;

    @ApiModelProperty("작업 예약번호")
    private String jobTaskId;

    @ApiModelProperty("파라미터")
    private String paramDesc;

    @ApiModelProperty("작업 정보")
    private JobContent jobContent;

}
