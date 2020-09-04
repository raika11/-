package jmnet.moka.core.tps.mvc.component.entity;

import java.io.Serializable;
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
import javax.persistence.Table;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_COMPONENT_WORK database table.
 * 
 */
@Entity
@Table(name = "WMS_COMPONENT_WORK")
@NamedQuery(name = "ComponentWork.findAll", query = "SELECT c FROM ComponentWork c")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ComponentWork implements Serializable {

    private static final long serialVersionUID = 2072557439143903488L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "EDITION_SEQ")
    private Long editionSeq;

    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ")
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATASET_SEQ", nullable = true, referencedColumnName = "DATASET_SEQ")
    private Dataset dataset;

    @Column(name = "DATA_TYPE")
    private String dataType;

    @Column(name = "SNAPSHOT_YN", columnDefinition = "char")
    private String snapshotYn;

    @Lob
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    @Column(name = "COMPONENT_ORDER")
    private Integer componentOrder;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

}
