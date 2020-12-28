package jmnet.moka.core.comment.mvc.comment.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "PA_CMT_Comment_URL")
@Data
public class CommentUrl implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ATCID", nullable = false)
    private Integer ATCID;

    @Column(name = "RE_REFER", nullable = false)
    private String reRefer;

    @Column(name = "GROUPID")
    private Integer GROUPID = 1;

}
