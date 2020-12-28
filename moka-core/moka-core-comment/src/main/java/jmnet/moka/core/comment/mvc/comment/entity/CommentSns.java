package jmnet.moka.core.comment.mvc.comment.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "PA_CMT_snsREALNAME")
public class CommentSns implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx", nullable = false)
    private Integer idx;

    @Column(name = "snsType", nullable = false)
    private String snsType;

    @Column(name = "snsID", nullable = false)
    private String snsID;

    @Column(name = "regNum", nullable = false)
    private String regNum;

    @Column(name = "insdate", nullable = false)
    private Date insdate;

    @Column(name = "snsKname")
    private String snsKname;

    @Column(name = "realName")
    private String realName;

}
