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
import jmnet.moka.common.utils.McpString;
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

    /**
     * 템플릿SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 템플릿명
     */
    @Nationalized
    @Column(name = "TEMPLATE_NAME", nullable = false, length = 128)
    private String templateName;

    /**
     * 템플릿본문
     */
    @Nationalized
    @Column(name = "TEMPLATE_BODY")
    @Builder.Default
    private String templateBody = "";

    /**
     * 크롭 가로
     */
    @Column(name = "CROP_WIDTH")
    @Builder.Default
    private Integer cropWidth = 0;

    /**
     * 크롭 세로
     */
    @Column(name = "CROP_HEIGHT")
    @Builder.Default
    private Integer cropHeight = 0;

    /**
     * 템플릿그룹
     */
    @Column(name = "TEMPLATE_GROUP", length = 24)
    private String templateGroup;

    /**
     * 템플릿가로
     */
    @Column(name = "TEMPLATE_WIDTH")
    @Builder.Default
    private Integer templateWidth = 0;

    /**
     * 템플릿썸네일경로
     */
    @Column(name = "TEMPLATE_THUMB", length = 256)
    private String templateThumb;

    /**
     * 상세정보
     */
    @Nationalized
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    /**
     * 등록자
     */
    @Column(name = "REG_ID", length = 30)
    private String regId;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID", length = 30)
    private String modId;
    
    @Transient
    private String templateGroupName;

    @PrePersist
    public void prePersist() {
        this.templateBody = McpString.defaultValue(this.templateBody, "");
        this.cropWidth = this.cropWidth == null ? 0 : this.cropWidth;
        this.cropHeight = this.cropHeight == null ? 0 : this.cropHeight;
        this.templateWidth = this.templateWidth == null ? 0 : this.templateWidth;
        this.regDt = McpDate.defaultValue(this.regDt);
    }

    @PreUpdate
    public void preUpdate() {
        this.templateBody = McpString.defaultValue(this.templateBody, "");
        this.cropWidth = this.cropWidth == null ? 0 : this.cropWidth;
        this.cropHeight = this.cropHeight == null ? 0 : this.cropHeight;
        this.templateWidth = this.templateWidth == null ? 0 : this.templateWidth;
        this.regDt = McpDate.defaultValue(this.regDt);
        this.modDt = McpDate.defaultValue(this.modDt);
    }
}
