package jmnet.moka.core.tps.mvc.component.entity;

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
import jmnet.moka.common.utils.McpDate;
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
 * The persistent class for the TB_WMS_COMPONENT_WORK database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_WORK")
@NamedQuery(name = "ComponentWork.findAll", query = "SELECT c FROM ComponentWork c")
public class ComponentWork implements Serializable {

    private static final long serialVersionUID = 2072557439143903488L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "COMPONENT_SEQ", nullable = false)
    private Long componentSeq;

    @Column(name = "REG_ID")
    private String regId;

    @Column(name = "EDITION_SEQ")
    private Long editionSeq;

    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATASET_SEQ", nullable = true, referencedColumnName = "DATASET_SEQ")
    private Dataset dataset;

    @Column(name = "DATA_TYPE", length = 24)
    private String dataType;

    @Column(name = "SNAPSHOT_YN", columnDefinition = "char")
    private String snapshotYn;

    @Nationalized
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    @Column(name = "COMPONENT_ORD")
    private Integer componentOrd;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.dataType = this.dataType == null ? "DESK" : this.dataType;
    }
}
