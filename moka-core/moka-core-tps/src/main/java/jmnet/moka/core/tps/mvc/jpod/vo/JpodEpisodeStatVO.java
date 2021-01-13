package jmnet.moka.core.tps.mvc.jpod.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.vo
 * ClassName : JpodEpisodeVO
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 17:37
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodEpisodeStatVO {

    /**
     * 사용중인 에피소드 건수
     */
    @ApiModelProperty(value = "사용중인 에피소드 건수", hidden = true)
    private Long usedCnt;

    /**
     * 사용 중지 중인 에피소드 건수
     */
    @ApiModelProperty(value = "사용 중지 중인 에피소드 건수", hidden = true)
    private Long unusedCnt;

    /**
     * 마지막 회차
     */
    @ApiModelProperty(value = "마지막 회차", hidden = true)
    private String lastEpsoNo;
}
