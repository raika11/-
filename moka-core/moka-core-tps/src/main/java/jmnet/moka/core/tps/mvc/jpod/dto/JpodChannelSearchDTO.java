package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.dto
 * ClassName : JpodChannelSearchDTO
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:42
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("J팟 채널 검색 DTO")
public class JpodChannelSearchDTO extends SearchDTO {

    @ApiModelProperty("사용여부")
    @Pattern(regexp = "[N|Y]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn;

    @ApiModelProperty("시작일시 검색")
    private Date startDt;

    @ApiModelProperty("종료일시 검색")
    private Date endDt;

}
