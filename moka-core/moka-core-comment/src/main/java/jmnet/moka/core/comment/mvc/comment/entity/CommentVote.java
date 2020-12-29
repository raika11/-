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
@Table(name = "PA_CMT_CommentVote")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentVote implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CMTVoteSN", nullable = false)
    private BigDecimal voteSN;

    @Column(name = "CMTSN", nullable = false)
    private Integer SN;

    @Column(name = "CMTVoteValue", nullable = false)
    private Integer voteValue = 0;

    @Column(name = "CMTVoteUserIP", nullable = false)
    private String voteUserIP;

    @Column(name = "CMTVoteRegDt", nullable = false)
    private Date voteRegDt;

}
