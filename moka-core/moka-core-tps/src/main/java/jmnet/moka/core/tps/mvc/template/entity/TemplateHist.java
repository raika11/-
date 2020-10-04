package jmnet.moka.core.tps.mvc.template.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
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
import jmnet.moka.common.utils.McpDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the WMS_TEMPLATE_HIST database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_TEMPLATE_HIST")
@NamedQuery(name = "TemplateHist.findAll", query = "SELECT t FROM TemplateHist t")
public class TemplateHist implements Serializable {

    private static final long serialVersionUID = -5653969038976101774L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    @Column(name = "DOMAIN_ID", columnDefinition = "char", nullable = true)
    private String domainId;

    @Nationalized
    @Column(name = "TEMPLATE_BODY")
    private String templateBody;

    @Column(name = "WORK_TYPE", columnDefinition = "char")
    private String workType;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 50)
    private String regId;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.workType = this.workType == null ? "U" : this.workType;
        this.regDt = this.regDt == null ? McpDate.now() : this.regDt;
    }
}
