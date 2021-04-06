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
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "TB_COMMENT_VOTE")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentVote implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    @Column(name = "CMT_SEQ", nullable = false)
    private Long cmtSeq;

    @Column(name = "VOTE_VALUE", nullable = false)
    private Integer voteValue = 0;

    @Column(name = "MEM_SEQ", nullable = false)
    private Long memSeq;

    @Nationalized
    @Column(name = "LOGIN_TYPE")
    private String loginType;

    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    @Column(name = "REG_IP")
    private String regIp;

    @Column(name = "PC_ID")
    private String pcId;

}
