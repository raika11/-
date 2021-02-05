package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.*;

import java.lang.reflect.Type;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("배포서버 검색 DTO")
public class DistributeServerSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<DistributeServerSearchDTO>>() {
    }.getType();

    @ApiModelProperty("별칭(서버명)")
    private String serverNm;

    @ApiModelProperty("서버IP(IP/URL)")
    private String serverIp;
}
