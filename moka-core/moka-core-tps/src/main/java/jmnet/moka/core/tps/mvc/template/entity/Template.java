package jmnet.moka.core.tps.mvc.template.entity;

import java.io.Serializable;
import java.util.Date;
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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the WMS_TEMPLATE database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_TEMPLATE")
@NamedQuery(name = "Template.findAll", query = "SELECT t FROM Template t")
public class Template implements Serializable {

    private static final long serialVersionUID = 8181884737274673595L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = true)
    private Domain domain;

    @Nationalized
    @Column(name = "TEMPLATE_NAME", nullable = false, length = 128)
    private String templateName;

    @Nationalized
    @Column(name = "TEMPLATE_BODY")
    private String templateBody;

    @Column(name = "CROP_WIDTH")
    private Integer cropWidth;

    @Column(name = "CROP_HEIGHT")
    private Integer cropHeight;

    @Column(name = "TEMPLATE_GROUP", length = 24)
    private String templateGroup;

    @Column(name = "TEMPLATE_WIDTH")
    private Integer templateWidth;

    @Column(name = "TEMPLATE_THUMB", length = 256)
    private String templateThumb;

    @Nationalized
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 30)
    private String regId;

    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    @Column(name = "MOD_ID", length = 30)
    private String modId;
    
    @Transient
    private String templateGroupName;

    @PrePersist
    public void prePersist() {
        this.regDt = McpDate.defaultValue(this.regDt);
    }

    @PreUpdate
    public void preUpdate() {
        this.regDt = McpDate.defaultValue(this.regDt);
        this.modDt = McpDate.defaultValue(this.modDt);
    }
}
