package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
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
@ApiModel("작업 등록 DTO")
public class JobContentSaveDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentSaveDTO>>() {
    }.getType();

    @ApiModelProperty(hidden = true)
    private Long jobSeq;

    @ApiModelProperty("사용 여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    @NotNull(message = "{tps.schedule-server.error.notnull.usedYn}")
    private String usedYn;

    @ApiModelProperty("분류")
    private String category;

    @ApiModelProperty("패키지 명")
    @NotNull(message = "{tps.schedule-server.error.notnull.pkgNm}")
    private String pkgNm;

    @ApiModelProperty("작업 타입 (S: 반복성, R: 일회성)")
    @Pattern(regexp = "[S|R]{1}$", message = "{tps.schedule-server.error.pattern.jobType}")
    @NotNull(message = "{tps.schedule-server.error.notnull.jobType}")
    private String jobType;

    @ApiModelProperty("작업 코드")
    private String jobCd;

    @ApiModelProperty("작업 명")
    private String jobNm;

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

    @ApiModelProperty("저장경로")
    private String targetPath;

    @ApiModelProperty("저장파일 명")
    private String targetFileName;

    @ApiModelProperty("설명")
    private String jobDesc;

    @ApiModelProperty("옵션 파라미터")
    private String pkgOpt;
}
