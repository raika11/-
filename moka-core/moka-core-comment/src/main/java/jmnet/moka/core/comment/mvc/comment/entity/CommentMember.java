package jmnet.moka.core.comment.mvc.comment.entity;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "PA_CMT_MEMBER")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentMember implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDX", nullable = false)
    private BigDecimal userIdx;

    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Column(name = "USER_KEY")
    private String userKey;

    @Column(name = "USER_NAME")
    private String userName;

    @Column(name = "USER_SITE")
    private String userSite;

    @Column(name = "USER_IMAGE")
    private String userImage;

    @Column(name = "USER_COOKIE")
    private String userCookie;

    @Column(name = "USER_REGDATE")
    private Date userRegDt;

    @Column(name = "USER_UPDATE")
    private Date userModDt;

    /**
     * 내 댓글 공개 여부
     */
    @Column(name = "PUBLIC_YN")
    private String publicYn = "Y";

}
