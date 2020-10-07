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
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the WMS_COMPONENT_HIST database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_HIST")
@NamedQuery(name = "ComponentHist.findAll", query = "SELECT c FROM ComponentHist c")
public class ComponentHist implements Serializable {

    private static final long serialVersionUID = -5085329432096691213L;

    public static final Type TYPE = new TypeReference<List<ComponentHist>>() {}.getType();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "COMPONENT_SEQ", nullable = false)
    private Long componentSeq;
    
    @Column(name = "DOMAIN_ID", columnDefinition = "char", nullable = false)
    private String domainId;
    
    @ManyToOne
    @JoinColumn(name = "DATASET_SEQ")
    private Dataset dataset;
    
    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;
    
    @Column(name = "DATA_TYPE", length = 24)
    private String dataType;

    @Nationalized
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;
    
    @Builder.Default
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    private String workType = "U";

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 30)
    private String regId;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.workType = McpString.defaultValue(this.workType, "U");
        this.regDt = McpDate.defaultValue(this.regDt);
    }
}
