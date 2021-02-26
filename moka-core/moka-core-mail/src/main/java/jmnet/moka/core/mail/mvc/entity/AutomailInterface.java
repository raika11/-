package jmnet.moka.core.mail.mvc.entity;

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
@Table(name = "automail_interface")
@Data
public class AutomailInterface implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "autocode", nullable = false)
    private Long autocode;

    @Column(name = "legacyid", nullable = false)
    private String legacyid;

    @Column(name = "mailtype", nullable = false)
    private String mailtype;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "insertdate", nullable = false)
    private Date insertdate;

    @Column(name = "sendtime", nullable = false)
    private Date sendtime;

    @Column(name = "sendyn")
    private String sendyn = "N";

    @Column(name = "opentime")
    private Date opentime;

    @Column(name = "senttime")
    private Date senttime;

    @Column(name = "cmpncode")
    private Integer cmpncode;

    @Column(name = "fromaddress")
    private String fromaddress;

    @Column(name = "fromname")
    private String fromname;

    @Column(name = "title")
    private String title;

    @Column(name = "tag1")
    private String tag1;

    @Column(name = "tag2")
    private String tag2;

    @Column(name = "tag3")
    private String tag3;

    @Column(name = "tag4")
    private String tag4;

    @Column(name = "tag5")
    private String tag5;

    @Column(name = "tag6")
    private String tag6;

    @Column(name = "tag7")
    private String tag7;

    @Column(name = "tag8")
    private String tag8;

    @Column(name = "tag9")
    private String tag9;

    @Column(name = "tag10")
    private String tag10;

}
