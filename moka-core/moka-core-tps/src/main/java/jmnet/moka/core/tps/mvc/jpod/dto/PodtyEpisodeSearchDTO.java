package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
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
@ApiModel("Podty 에피소드 검색 DTO")
public class PodtyEpisodeSearchDTO extends SearchDTO {
    
    @ApiModelProperty("정렬 순서(desc : 최신순, asc : 과거순)")
    @Builder.Default
    private String direction = "desc";

}
