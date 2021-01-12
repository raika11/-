package jmnet.moka.core.tps.mvc.comment.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_COMMENT")
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
    @Enumerated(EnumType.STRING)
    private CommentStatusType status = CommentStatusType.A;

    @Column(name = "CMT_LIKE_CNT", nullable = false)
    private Integer likeCnt = 0;

    @Column(name = "CMT_HATE_CNT", nullable = false)
    private Integer hateCnt = 0;

    @Column(name = "CMT_DECLARE_CNT", nullable = false)
    private Integer declareCnt = 0;

    @Column(name = "CMT_CONTENT")
    private String cont;

    @Column(name = "MEM_ID", nullable = false)
    private String memId;

    @Column(name = "MEM_NM", nullable = false)
    private String memNm;

    @Column(name = "MEM_SITE", nullable = false)
    private String memSite;

    @Column(name = "MEM_IMAGE")
    private String memImage;

    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    @Column(name = "MEM_IP")
    private String memIp;

    @Column(name = "REG_DEV")
    private String regDev;

}
