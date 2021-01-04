package jmnet.moka.core.tps.mvc.comment.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.comment.mvc.comment.vo
 * ClassName : CommentVO
 * Created : 2020-12-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-28 15:58
 */

@Alias("CommentVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentVO implements Serializable {

    private Long urlSeq;

    private String contentId;

    private Long cmtSeq;

    @Builder.Default
    private Long cmtParentSeq = 0L;

    private String cont;

    @Builder.Default
    private Integer likeCnt = 0;

    @Builder.Default
    private Integer hateCnt = 0;

    private String userId;

    private String userName;

    private String userImage;

    private Date regDt;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    private String status;

    private String userIp;

    private String userSite;

    @Builder.Default
    private Integer declareCnt = 0;

    private Long reCnt;

    @Builder.Default
    private Integer urlGrp = 0;

    private String artTitle;
}
