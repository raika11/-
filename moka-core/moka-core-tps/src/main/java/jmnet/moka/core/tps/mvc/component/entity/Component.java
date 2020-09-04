package jmnet.moka.core.tps.mvc.component.entity;

import java.io.Serializable;
import java.lang.reflect.Type;
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
import javax.persistence.Table;
import javax.persistence.Transient;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_COMPONENT database table.
 * 
 */
@Entity
@Table(name = "WMS_COMPONENT")
@NamedQuery(name = "Component.findAll", query = "SELECT c FROM Component c")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Component implements Serializable {

    private static final long serialVersionUID = 1003720414088222277L;

    public static final Type TYPE = new TypeReference<List<Component>>() {
    }.getType();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    @Column(name = "COMPONENT_NAME")
    private String componentName;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DATASET_SEQ", nullable = true, referencedColumnName = "DATASET_SEQ")
    private Dataset dataset;

    @Builder.Default
    @Column(name = "DATA_TYPE")
    private String dataType = TpsConstants.DATATYPE_DESK;

    @Column(name = "DEL_WORDS")
    private String delWords;

    @Column(name = "DISP_PAGE_COUNT")
    private Integer dispPageCount;

    @ManyToOne
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Column(name = "MAX_PAGE_COUNT")
    private Integer maxPageCount;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Column(name = "MORE_COUNT")
    private Integer moreCount;

    @Column(name = "PAGING_TYPE", columnDefinition = "char")
    private String pagingType;

    @Builder.Default
    @Column(name = "PAGING_YN", columnDefinition = "char")
    private String pagingYn = "N";

    @Column(name = "PER_PAGE_COUNT")
    private Integer perPageCount;

    @Column(name = "PERIOD_END_YMDT")
    private String periodEndYmdt;

    @Column(name = "PERIOD_START_YMDT")
    private String periodStartYmdt;

    @Builder.Default
    @Column(name = "PERIOD_YN", columnDefinition = "char")
    private String periodYn = "Y";

    @Column(name = "SEARCH_CODE_ID")
    private String searchCodeId;

    @Builder.Default
    @Column(name = "SEARCH_LANG")
    private String searchLang = "KR";

    @Column(name = "SEARCH_SERVICE_TYPE")
    private String searchServiceType;

    @Lob
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    @Column(name = "SNAPSHOT_YN", columnDefinition = "char")
    private String snapshotYn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEMPLATE_SEQ")
    private Template template;

    //    @ManyToOne(fetch = FetchType.EAGER)
    //    @JoinColumn(name = "SKIN_SEQ", referencedColumnName = "SKIN_SEQ")
    //    private Skin skin;

    @Column(name = "PREVIEW_RSRC", length = 2048)
    private String previewRsrc;

    @Transient
    private Set<ComponentAd> componentAdList;

}
