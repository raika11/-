package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("작업 수정 DTO")
public class JobContentUpdateDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentUpdateDTO>>() {
    }.getType();

    @ApiModelProperty(hidden = true)
    private Long jobSeq;

    @ApiModelProperty("사용 여부")
    //@Pattern(regexp = "[Y|N]{1}$", message = "{tps.schedule-server.error.pattern.usedYn}")
    //@NotNull(message = "{tps.schedule-server.error.notnull.usedYn}")
    private String usedYn;

    @ApiModelProperty("분류")
    private String category;

    @ApiModelProperty("패키지 명")
    //@NotNull(message = "{tps.schedule-server.error.notnull.pkgNm}")
    private String pkgNm;

    @ApiModelProperty("작업 타입 (S: 반복성, R: 일회성)")
    //@Pattern(regexp = "[S|R]{1}$", message = "{tps.schedule-server.error.pattern.jobType}")
    private String jobType;

    @ApiModelProperty("작업 코드")
    private String jobCd;

    @ApiModelProperty("주기")
    private Long period;

    @ApiModelProperty("전송타입")
    private String sendType;

    @ApiModelProperty("배포서버 일련번호")
    private Long serverSeq;

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

}
