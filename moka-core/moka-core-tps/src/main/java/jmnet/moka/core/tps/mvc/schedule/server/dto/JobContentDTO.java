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
@ApiModel("작업 DTO")
public class JobContentDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentDTO>>() {
    }.getType();


    @ApiModelProperty("작업 번호")
    private Long jobSeq;

    @ApiModelProperty("사용 여부")
    private String usedYn;

    @ApiModelProperty("삭제 여부")
    private String delYn;

    @ApiModelProperty("분류")
    private String category;

    @ApiModelProperty("패키지 명")
    private String pkgNm;

    @ApiModelProperty("작업 타입")
    private String jobType;

    @ApiModelProperty("작업 코드")
    private String jobCd;

    @ApiModelProperty("작업 명")
    private String jobNm;

    @ApiModelProperty("배포서버 일련번호")
    private Long serverSeq;

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

    @ApiModelProperty("옵션 파라미터")
    private String pkgOpt;

    @ApiModelProperty("등록일시")
    private Date regDt;

    @ApiModelProperty("등록자")
    private String regId;

    @ApiModelProperty("수정일시")
    private Date modDt;

    @ApiModelProperty("수정자")
    private String modId;

    @ApiModelProperty("작업설명")
    private JobStatus jobStatus;

    @ApiModelProperty("등록자정보")
    private MemberSimpleInfo regMember;

    @ApiModelProperty("수정자정보")
    private MemberSimpleInfo modMember;
}
