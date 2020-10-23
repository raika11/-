package jmnet.moka.core.tps.mvc.dataset.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * The persistent class for the WMS_DATASET database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_DATASET")
@NamedQuery(name = "Dataset.findAll", query = "SELECT d FROM Dataset d")
public class Dataset extends BaseAudit {

    private static final long serialVersionUID = 2114564214212670123L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @Nationalized
    @Column(name = "DATASET_NAME", nullable = false, length = 128)
    private String datasetName;

    @Column(name = "DATA_API_HOST", nullable = false, length = 256)
    private String dataApiHost;

    @Column(name = "DATA_API_PATH", nullable = false, length = 256)
    private String dataApiPath;

    @Column(name = "DATA_API", length = 256)
    private String dataApi;

    @Nationalized
    @Column(name = "DATA_API_PARAM", length = 2048)
    private String dataApiParam;

    @Nationalized
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "AUTO_CREATE_YN", columnDefinition = "char")
    private String autoCreateYn;

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

    @PrePersist
    public void prePersist() {
        this.datasetName = McpString.defaultValue(this.datasetName);
        this.dataApiHost = McpString.defaultValue(this.dataApiHost);
        this.dataApiPath = McpString.defaultValue(this.dataApiPath);
        this.autoCreateYn = McpString.defaultValue(this.autoCreateYn, MokaConstants.NO);
    }

    @PreUpdate
    public void preUpdate() {
        this.datasetName = McpString.defaultValue(this.datasetName);
        this.dataApiHost = McpString.defaultValue(this.dataApiHost);
        this.dataApiPath = McpString.defaultValue(this.dataApiPath);
        this.autoCreateYn = McpString.defaultValue(this.autoCreateYn, MokaConstants.NO);
    }
}
