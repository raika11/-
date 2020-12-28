package jmnet.moka.core.comment.mvc.comment.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "PA_CMT_Comment")
@Data
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private CommentPk commentId;

    @Column(name = "TOTAL_ID")
    private String totalId;

    @Column(name = "ATCID")
    private Integer atcid;


    @Column(name = "CMTCont")
    private String cont;

    @Column(name = "CMTGoodCnt", nullable = false)
    private Integer goodCnt = 0;

    @Column(name = "CMTBadCnt", nullable = false)
    private Integer badCnt = 0;

    @Column(name = "CMTUserID", nullable = false)
    private String userID;

    @Column(name = "CMTUserName", nullable = false)
    private String userName;

    @Column(name = "CMTUserImage")
    private String userImage;

    @Column(name = "CMTRegDt", nullable = false)
    private Date regDt;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    @Column(name = "CMTState")
    private String state;

    @Column(name = "CMTUserIP")
    private String userIp;

    @Column(name = "CMTVoteSN", nullable = false)
    private Integer voteSn = 0;

    @Column(name = "CMTRepoCnt", nullable = false)
    private Integer repoCnt = 0;

    @Column(name = "CMTUserType")
    private String userType = "joins";

    @Column(name = "SNSAID")
    private String snsaid;

    @Column(name = "REG_DEV")
    private String regDev;

}
