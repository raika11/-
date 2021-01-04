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
public class CommentSaveDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long cmtParentSeq;

    private Long urlSeq;

    private String contentId;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    private String status;

    private Integer likeCnt = 0;

    private Integer hateCnt = 0;

    private Integer declareCnt = 0;

    private Long voteSeq = 0l;

    private String cont;

    private String userId;

    private String userName;

    private String userSite;

    private String userImage;

    private Date regDt;

    private Integer repoCnt = 0;

    private String userType = "joins";

    private String snsaid;

    private String regDev;

}
