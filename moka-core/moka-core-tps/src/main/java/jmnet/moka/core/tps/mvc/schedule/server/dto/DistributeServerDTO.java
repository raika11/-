package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.tps.mvc.schedule.server.entity.Member;
import lombok.*;

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
@ApiModel("배포서버 DTO")
public class DistributeServerDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<DistributeServerDTO>>() {
    }.getType();

    @ApiModelProperty("서버 일련번호")
    private Long serverSeq;

    @ApiModelProperty("별칭")
    private String serverNm;

    @ApiModelProperty("IP/HOST")
    private String serverIp;

    @ApiModelProperty("계정정보")
    private String accessId;

    @ApiModelProperty("등록일시")
    private Date regDt;

    @ApiModelProperty("등록자")
    private String regId;

    @ApiModelProperty("수정일시")
    private Date modDt;

    @ApiModelProperty("수정자")
    private String modId;

    @ApiModelProperty("등록자정보")
    private Member regMember;

    @ApiModelProperty("수정자정보")
    private Member modMember;
}
