package jmnet.moka.core.tps.mvc.comment.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_CMT")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CMT_SEQ", nullable = false)
    private Long cmtSeq;

    @Column(name = "CMT_PARENT_SEQ", nullable = false)
    @Builder.Default
    private Long cmtParentSeq = 0L;

    @Column(name = "URL_SEQ")
    private Integer urlSeq;

    @Column(name = "CONTENT_ID")
    private String contentId;

    /**
     * A:노출,N:관리자삭제,D:사용자삭제
     */
    @Column(name = "CMT_STATUS")
    private String status;

    @Column(name = "CMT_LIKE_CNT", nullable = false)
    private Integer likeCnt = 0;

    @Column(name = "CMT_HATE_CNT", nullable = false)
    private Integer hateCnt = 0;

    @Column(name = "CMT_DECLARE_CNT", nullable = false)
    private Integer declareCnt = 0;

    @Column(name = "CMT_VOTE_SEQ", nullable = false)
    private Long voteSeq = 0l;

    @Column(name = "CMT_CONTENT")
    private String cont;

    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Column(name = "USER_NAME", nullable = false)
    private String userName;

    @Column(name = "USER_SITE", nullable = false)
    private String userSite;

    @Column(name = "USER_IMAGE")
    private String userImage;

    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    @Column(name = "USER_IP")
    private String userIp;

    @Column(name = "SNSAID")
    private String snsaid;

    @Column(name = "REG_DEV")
    private String regDev;

}
