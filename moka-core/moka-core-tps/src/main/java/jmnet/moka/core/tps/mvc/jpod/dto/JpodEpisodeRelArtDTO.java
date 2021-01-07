package jmnet.moka.core.tps.mvc.jpod.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
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

    @ApiModelProperty(value = "서비스기사아이디")
    private Long totalId;

    @ApiModelProperty(value = "링크 순서")
    private Integer ordNo = 1;

    @ApiModelProperty(value = "링크 제목")
    private String relTitle;

    @ApiModelProperty(value = "링크 URL")
    private String relLink;

    @ApiModelProperty(value = "링크 타겟")
    private String relLinkTarget;

}
