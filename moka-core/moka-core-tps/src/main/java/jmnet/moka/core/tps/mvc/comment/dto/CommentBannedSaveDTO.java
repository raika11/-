package jmnet.moka.core.tps.mvc.comment.dto;

import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 댓글금지
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentBannedSaveDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 금지타입 I/U/W - 아이피/사용자/단어
     */
    @ApiModelProperty("금지타입 I/U/W - 아이피/사용자/단어")
    @NotNull(message = "{tps.comment-banned.error.notnull.tagType}")
    private CommentBannedType tagType = CommentBannedType.W;

    /**
     * 설정/해제여부
     */
    @ApiModelProperty("사용여부(Y:사용, N:미사용)")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.comment-banned.error.size.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 금지IP/금지사용자/금지단어
     */
    @ApiModelProperty("금지IP/금지사용자/금지단어")
    @NotNull(message = "{tps.comment-banned.error.notnull.tagValue}")
    private List<@Size(max = 200, message = "{tps.comment-banned.error.size.tagValue}") String> tagValues;

    /**
     * 금지IP/금지사용자/금지단어
     */
    @ApiModelProperty("태그구분 - 기타코드")
    @NotNull(message = "{tps.comment-banned.error.notnull.tagDiv}")
    @Size(max = 24, message = "{tps.comment-banned.error.size.tagDiv}")
    private String tagDiv;

    /**
     * 태그설명
     */
    @ApiModelProperty("태그설명")
    @Size(max = 200, message = "{tps.comment-banned.error.size.tagDesc}")
    private String tagDesc;

}
