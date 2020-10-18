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
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.entity.BaseAudit;
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
public class TemplateHist extends BaseAudit {

    private static final long serialVersionUID = -5653969038976101774L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 템플릿
     */
    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID", columnDefinition = "char", nullable = false)
    private String domainId;

    /**
     * 템플릿본문
     */
    @Nationalized
    @Column(name = "TEMPLATE_BODY")
    @Builder.Default
    private String templateBody = "";

    /**
     * 작업유형
     */
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    @Builder.Default
    private String workType = "U";

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.templateBody = McpString.defaultValue(this.templateBody, "");
        this.workType = McpString.defaultValue(this.workType, "U");
    }
}
