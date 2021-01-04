package jmnet.moka.core.tps.mvc.comment.dto;

import java.io.Serializable;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long cmtSeq;

    @Builder.Default
    private Long cmtParentSeq = 0L;

    private Integer urlSeq;

    private String contentId;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    private String status;

    @Builder.Default
    private Integer likeCnt = 0;

    @Builder.Default
    private Integer hateCnt = 0;

    @Builder.Default
    private Integer declareCnt = 0;

    @Builder.Default
    private Long voteSeq = 0l;

    private String cont;

    private String userId;

    private String userName;

    private String userSite;

    private String userImage;

    private Date regDt;

    private String userIp;

    private String snsaid;

    private String regDev;

}
