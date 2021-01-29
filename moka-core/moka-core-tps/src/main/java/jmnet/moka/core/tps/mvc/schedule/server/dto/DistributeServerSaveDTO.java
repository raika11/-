package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.tps.mvc.schedule.server.entity.Member;
import lombok.*;

import javax.validation.constraints.Min;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("배포서버 등록 DTO")
public class DistributeServerSaveDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<DistributeServerSaveDTO>>() {
    }.getType();

    @ApiModelProperty(hidden = true)
    private Long serverSeq;

    @ApiModelProperty("별칭")
    private String serverNm;

    @ApiModelProperty("IP/HOST")
    private String serverIp;

    @ApiModelProperty("계정정보")
    private String accessId;

    @ApiModelProperty("계정비밀번호")
    private String accessPwd;

    @ApiModelProperty("등록일시")
    private Date regDt;

    @ApiModelProperty("등록자")
    private String regId;
}
