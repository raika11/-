package jmnet.moka.core.tps.mvc.comment.dto;

import jmnet.moka.common.data.support.SearchDTO;
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
public class CommentBannedSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    private CommentBannedType tagType = CommentBannedType.W;

    private String tagDiv;
}
