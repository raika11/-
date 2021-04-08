package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatus;
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
@ApiModel("삭제된 작업 DTO")
public class JobDeletedContentDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobDeletedContentDTO>>() {
    }.getType();


    @ApiModelProperty("일련 번호")
    private Long seqNo;

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

    @ApiModelProperty("배포경로")
    private String targetPath;

    @ApiModelProperty("설명")
    private String jobDesc;

    @ApiModelProperty("등록일시")
    private Date regDt;

    @ApiModelProperty("등록자")
    private String regId;

    @ApiModelProperty("작업정보")
    private JobStatus jobStatus;

    @ApiModelProperty("등록자정보")
    private MemberSimpleInfo regMember;
}
