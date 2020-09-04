package jmnet.moka.core.tps.mvc.template.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_TEMPLATE database table.
 * 
 */
@Entity
@Table(name = "WMS_TEMPLATE")
@NamedQuery(name = "Template.findAll", query = "SELECT t FROM Template t")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Template implements Serializable {

    private static final long serialVersionUID = 8181884737274673595L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "CROP_HEIGHT")
    private int cropHeight;

    @Column(name = "CROP_WIDTH")
    private int cropWidth;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = true)
    private Domain domain;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Lob
    @Column(name = "TEMPLATE_BODY")
    private String templateBody;

    @Column(name = "TEMPLATE_GROUP")
    private String templateGroup;
    
    @Transient
    private String templateGroupName;

    @Column(name = "TEMPLATE_NAME")
    private String templateName;

    @Column(name = "TEMPLATE_THUMBNAIL")
    private String templateThumbnail;

    @Column(name = "TEMPLATE_WIDTH")
    private Integer templateWidth;

}
