package jmnet.moka.core.tps.mvc.template.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 템플릿 히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_TEMPLATE_HIST")
public class TemplateHist extends RegAudit {

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
    private String workType = TpsConstants.WORKTYPE_UPDATE;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.templateBody = McpString.defaultValue(this.templateBody);
        this.workType = McpString.defaultValue(this.workType, TpsConstants.WORKTYPE_UPDATE);
    }
}
