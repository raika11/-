package jmnet.moka.core.tps.mvc.comment.dto;

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
 * Package : jmnet.moka.core.comment.mvc.comment.dto
 * ClassName : CommentSearchDTO
 * Created : 2020-12-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-28 15:49
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentSearchDTO extends SearchDTO {

    private String contentId;

    private String refer;

    private String orderType;

    private String status;

    private String startDt;

    private String endDt;

    private String userType;

    private String referType;

}
