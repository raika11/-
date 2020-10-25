package jmnet.moka.core.tps.mvc.component.entity;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
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
import com.fasterxml.jackson.core.type.TypeReference;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 컴포넌트 히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_HIST")
public class ComponentHist extends RegAudit {

    private static final long serialVersionUID = -5085329432096691213L;

    public static final Type TYPE = new TypeReference<List<ComponentHist>>() {}.getType();

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 컴포넌트SEQ
     */
    @Column(name = "COMPONENT_SEQ", nullable = false)
    private Long componentSeq;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID", columnDefinition = "char", nullable = false)
    private String domainId;

    /**
     * 데이타셋
     */
    @ManyToOne
    @JoinColumn(name = "DATASET_SEQ")
    private Dataset dataset;

    /**
     * 템플릿
     */
    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    /**
     * 데이터유형:NONE, DESK, AUTO
     */
    @Column(name = "DATA_TYPE")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_DESK;

    /**
     * 스냅샷본문
     */
    @Nationalized
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    /**
     * 작업유형
     */
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    @Builder.Default
    private String workType = TpsConstants.WORKTYPE_UPDATE;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.workType = McpString.defaultValue(this.workType, TpsConstants.WORKTYPE_UPDATE);
        this.dataType = McpString.defaultValue(this.dataType, TpsConstants.DATATYPE_DESK);
    }
}
