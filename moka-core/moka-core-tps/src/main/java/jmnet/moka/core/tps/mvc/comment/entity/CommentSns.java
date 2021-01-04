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
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_CMT_SNS_REALNAME")
public class CommentSns implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Integer seqNo;

    @Column(name = "SNS_SITE", nullable = false)
    private String snsSite;

    @Column(name = "SNS_ID", nullable = false)
    private String snsID;

    @Column(name = "REG_NUM", nullable = false)
    private String regNum;

    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    @Column(name = "SNS_NAME")
    private String snsKname;

    @Column(name = "SNS_REALNAME")
    private String realName;

}
