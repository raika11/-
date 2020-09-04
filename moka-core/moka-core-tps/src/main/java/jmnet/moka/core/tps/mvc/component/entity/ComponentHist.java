package jmnet.moka.core.tps.mvc.component.entity;

import java.io.Serializable;
import java.lang.reflect.Type;
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
import javax.persistence.Table;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_COMPONENT_HIST database table.
 * 
 */
@Entity
@Table(name = "WMS_COMPONENT_HIST")
@NamedQuery(name = "ComponentHist.findAll", query = "SELECT c FROM ComponentHist c")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ComponentHist implements Serializable {

    private static final long serialVersionUID = -5085329432096691213L;

    public static final Type TYPE = new TypeReference<List<ComponentHist>>() {}.getType();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;
    
    @Column(name = "DOMAIN_ID", columnDefinition = "char")
    private String domainId;
    
    @ManyToOne
    @JoinColumn(name = "DATASET_SEQ")
    private Dataset dataset;
    
    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ")
    private Template template;
    
    @Column(name = "DATA_TYPE")
    private String dataType;
    
    @Lob
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;
    
    @Builder.Default
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    private String workType = "U";

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;
}
