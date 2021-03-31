package jmnet.moka.core.tps.mvc.schedule.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
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
@ApiModel("작업코드 DTO")
public class JobContentCodeDTO {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<JobContentCodeDTO>>() {
    }.getType();


    @ApiModelProperty("작업 번호")
    private Long jobSeq;

    @ApiModelProperty("작업 명")
    private String jobNm;
}
