package jmnet.moka.core.tps.mvc.jpod.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.code.LinkTargetCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 관련기사
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodEpisodeRelArtDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private JpodEpisodeRelArtId id;

    @ApiModelProperty(value = "링크 순서")
    private Integer ordNo = 1;

    @ApiModelProperty(value = "링크 제목")
    @Size(max = 510, message = "{tps.jpod-episode.error.size.relTitle}")
    private String relTitle;

    @ApiModelProperty(value = "링크 URL")
    @Size(max = 200, message = "{tps.jpod-episode.error.size.relLink}")
    private String relLink;

    @ApiModelProperty(value = "링크 타겟")
    @Builder.Default
    private LinkTargetCode relLinkTarget = LinkTargetCode.S;

}
