package jmnet.moka.core.tps.mvc.comment.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_COMMENT_MEMBER")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentMember implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEM_SEQ", nullable = false)
    private Long memSeq;

    @Column(name = "MEM_ID", nullable = false)
    private String memId;

    @Column(name = "MEM_KEY")
    private String memKey;

    @Column(name = "MEM_NM")
    private String memNm;

    @Column(name = "MEM_SITE")
    private String memSite;

    @Column(name = "MEM_IMAGE")
    private String memImage;

    @Column(name = "REG_DT")
    private Date regDt;

    @Column(name = "MOD_DT")
    private Date modDt;

    @Column(name = "REAL_CHK_DT")
    private Date regChkDt;

    /**
     * 내 댓글 공개 여부
     */
    @Column(name = "PUBLIC_YN")
    private String publicYn = MokaConstants.YES;

}
