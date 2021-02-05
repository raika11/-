package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServer;
import jmnet.moka.core.tps.mvc.schedule.server.entity.DistributeServerSimple;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatus;
import lombok.*;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("작업실행상태 DTO")
public class JobStatisticDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobStatisticDTO>>() {
    }.getType();
    @ApiModelProperty("사용 여부")
    private String usedYn;

    @ApiModelProperty("작업 번호")
    private Long jobSeq;

    @ApiModelProperty("배포서버 일련번호")
    private Long serverSeq;

    @ApiModelProperty("분류")
    private String category;

    @ApiModelProperty("주기")
    private Long period;

    @ApiModelProperty("전송타입")
    private String sendType;

    @ApiModelProperty("FTP포트")
    private Long ftpPort;

    @ApiModelProperty("FTP PASSIVE 여부")
    private String ftpPassive;

    @ApiModelProperty("URL")
    private String callUrl;

    @ApiModelProperty("배포경로")
    private String targetPath;

    @ApiModelProperty("설명")
    private String jobDesc;

    @ApiModelProperty("배포서버 정보")
    private DistributeServerSimple distributeServerSimple;

    @ApiModelProperty("작업상태 정보")
    private JobStatus jobStatus;
}
