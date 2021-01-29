package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
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
@ApiModel("배포서버 DTO(검색조건 코드)")
public class DistributeServerCodeDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<DistributeServerCodeDTO>>() {
    }.getType();


    @ApiModelProperty("서버 일련번호")
    private Long serverSeq;

    @ApiModelProperty("배포서버 명")
    private String serverNm;
}
