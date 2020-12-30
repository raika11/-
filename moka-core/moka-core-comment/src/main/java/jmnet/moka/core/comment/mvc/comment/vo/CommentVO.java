package jmnet.moka.core.comment.mvc.comment.vo;

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

    private Long commentSeq;

    @Builder.Default
    private Long psn = 0L;

    private Long totalId;

    private String atcid;

    private String cont;

    @Builder.Default
    private Integer goodCnt = 0;

    @Builder.Default
    private Integer badCnt = 0;

    private String userID;

    private String userName;

    private String userImage;

    private Date regDt;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    private String state;

    private String userIp;

    @Builder.Default
    private Integer voteSn = 0;

    @Builder.Default
    private Integer repoCnt = 0;

    private Long reCnt;

    private String userType;

    private String referType;

    private String artTitle;
}
