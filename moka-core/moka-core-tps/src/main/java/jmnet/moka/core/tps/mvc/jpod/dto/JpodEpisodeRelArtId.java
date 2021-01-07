package jmnet.moka.core.tps.mvc.jpod.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.entity
 * ClassName : JpodEpisodeRelArtPk
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 11:19
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
public class JpodEpisodeRelArtId implements Serializable {

    /**
     * 에피소드일련번호
     */
    @ApiModelProperty(value = "에피소드 일련번호", hidden = true)
    private Long epsdSeq;

    /**
     * 서비스기사아이디
     */
    @NotNull(message = "{tps.jpod-episode.error.notnull.totalId}")
    @Min(value = 0, message = "{tps.jpod-episode.error.min.totalId}")
    @ApiModelProperty(value = "서비스기사아이디")
    private Long totalId;

    /**
     * 채널일련번호
     */
    @ApiModelProperty(value = "채널 일련번호", hidden = true)
    private Long chnlSeq;


}
