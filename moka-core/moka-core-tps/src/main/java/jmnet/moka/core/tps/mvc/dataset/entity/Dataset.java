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
import lombok.Builder.Default;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 데이타셋
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_DATASET")
public class Dataset extends BaseAudit {

    private static final long serialVersionUID = 2114564214212670123L;

    /**
     * 데이터셋SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    /**
     * 데이터셋명
     */
    @Nationalized
    @Column(name = "DATASET_NAME", nullable = false)
    private String datasetName;

    /**
     * 데이터API경로(기타코드)
     */
    @Column(name = "DATA_API_PATH", nullable = false)
    private String dataApiPath;

    /**
     * 데이터API호스트(기타코드)
     */
    @Column(name = "DATA_API_HOST", nullable = false)
    private String dataApiHost;

    /**
     * 데이터API
     */
    @Column(name = "DATA_API")
    private String dataApi;

    /**
     * 데이터API파라미터
     */
    @Nationalized
    @Column(name = "DATA_API_PARAM")
    private String dataApiParam;

    /**
     * 상세정보
     */
    @Nationalized
    @Column(name = "DESCRIPTION")
    private String description;

    /**
     * 자동생성여부
     */
    @Column(name = "AUTO_CREATE_YN", columnDefinition = "char")
    @Builder.Default
    private String autoCreateYn = MokaConstants.NO;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.autoCreateYn = McpString.defaultValue(this.autoCreateYn, MokaConstants.NO);
    }
}
