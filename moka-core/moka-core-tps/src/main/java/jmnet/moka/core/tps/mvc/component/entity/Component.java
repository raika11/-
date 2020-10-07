package jmnet.moka.core.tps.mvc.component.entity;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import java.util.Set;
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
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the TB_WMS_COMPONENT database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT")
@NamedQuery(name = "Component.findAll", query = "SELECT c FROM Component c")
public class Component implements Serializable {

    private static final long serialVersionUID = 1003720414088222277L;

    public static final Type TYPE = new TypeReference<List<Component>>() {}.getType();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    @ManyToOne
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DATASET_SEQ", referencedColumnName = "DATASET_SEQ", nullable = true)
    private Dataset dataset;

    @Nationalized
    @Column(name = "COMPONENT_NAME", nullable = false, length = 128)
    private String componentName;

    @Nationalized
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Builder.Default
    @Column(name = "PERIOD_YN", columnDefinition = "char")
    private String periodYn = "N";

    @Column(name = "PERIOD_START_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date periodStartDt;

    @Column(name = "PERIOD_END_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date periodEndDt;

    @Builder.Default
    @Column(name = "DATA_TYPE", length = 24)
    private String dataType = TpsConstants.DATATYPE_DESK;

    @Nationalized
    @Column(name = "DEL_WORDS", length = 256)
    private String delWords;

    @Builder.Default
    @Column(name = "PAGING_YN", columnDefinition = "char")
    private String pagingYn = "N";

    @Column(name = "PAGING_TYPE", columnDefinition = "char")
    private String pagingType;

    @Column(name = "PER_PAGE_COUNT")
    private Integer perPageCount;

    @Column(name = "MAX_PAGE_COUNT")
    private Integer maxPageCount;

    @Column(name = "DISP_PAGE_COUNT")
    private Integer dispPageCount;

    @Column(name = "MORE_COUNT")
    private Integer moreCount;

    @Column(name = "SCH_SERVICE_TYPE", length = 24)
    private String schServiceType;

    @Builder.Default
    @Column(name = "SCH_LANGUAGE", length = 24)
    private String schLanguage = "KR";

    @Column(name = "SCH_CODE_ID", length = 24)
    private String schCodeId;

    @Column(name = "SNAPSHOT_YN", columnDefinition = "char")
    private String snapshotYn;

    @Nationalized
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    //    @ManyToOne(fetch = FetchType.EAGER)
    //    @JoinColumn(name = "SKIN_SEQ", referencedColumnName = "SKIN_SEQ")
    //    private Skin skin;

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
    private Set<ComponentAd> componentAdList;

    @PrePersist
    public void prePersist() {
        this.periodYn = McpString.defaultValue(this.periodYn, "N");
        this.dataType = McpString.defaultValue(this.dataType, "DESK");
        this.pagingYn = McpString.defaultValue(this.pagingYn, "N");
        this.schLanguage = McpString.defaultValue(this.schLanguage, "KR");
        this.regDt = McpDate.defaultValue(this.regDt);
    }

    @PreUpdate
    public void preUpdate() {
        this.periodYn = McpString.defaultValue(this.periodYn, "N");
        this.dataType = McpString.defaultValue(this.dataType, "DESK");
        this.pagingYn = McpString.defaultValue(this.pagingYn, "N");
        this.schLanguage = McpString.defaultValue(this.schLanguage, "KR");
        this.regDt = McpDate.defaultValue(this.regDt);
        this.modDt = McpDate.defaultValue(this.modDt);
    }
}
