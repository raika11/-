package jmnet.moka.core.comment.mvc.comment.dto;

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

    private Long totalId;

    private String atcid;


    private String cont;

    private Integer goodCnt = 0;

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

    private Integer voteSn = 0;

    private Integer repoCnt = 0;

    private String userType = "joins";

    private String snsaid;

    private String regDev;

}
