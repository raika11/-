package jmnet.moka.core.tps.mvc.component.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 컴포넌트DTO
 * 
 * @author jeon
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentDTO implements Serializable {

    private static final long serialVersionUID = 7271351833690295727L;

    public static final Type TYPE = new TypeReference<List<ComponentDTO>>() {}.getType();

    private Long componentSeq;

    @NotNull(message = "{tps.component.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.component.error.invalid.templateSeq}")
    private TemplateSimpleDTO template;

    private DatasetDTO dataset;

    @NotNull(message = "{tps.component.error.invalid.componentName}")
    @Pattern(regexp = ".+", message = "{tps.component.error.invalid.componentName}")
    private String componentName;
    
    private String description;

    @Builder.Default
    private String periodYn = "N";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = MokaConstants.JSON_DATE_FORMAT, timezone = MokaConstants.JSON_DATE_TIME_ZONE)
    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private Date periodStartDt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = MokaConstants.JSON_DATE_FORMAT, timezone = MokaConstants.JSON_DATE_TIME_ZONE)
    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private Date periodEndDt;

    @Builder.Default
    private String dataType = "NONE";

    private String delWords;

    @Builder.Default
    private String pagingYn = "N";

    private String pagingType;

    private Integer perPageCount;

    private Integer maxPageCount;

    private Integer dispPageCount;

    private Integer moreCount;

    private String schServiceType;

    private String schLanguage;

    private String schCodeId;

    @Builder.Default
    private String snapshotYn = "N";

    private String snapshotBody;

    private Skin skin;

    private DatasetDTO prevAutoDataset;
    
    private DatasetDTO prevDeskDataset;

    @JsonInclude
    private LinkedHashSet<ComponentAdDTO> componentAdList;

    public ComponentItem toComponentItem() {
        ComponentItem componentItem = new ComponentItem();
        componentItem.put(ItemConstants.COMPONENT_ID, this.componentSeq);
        componentItem.put(ItemConstants.COMPONENT_DOMAIN_ID, this.domain.getDomainId());
        componentItem.put(ItemConstants.COMPONENT_TEMPLATE_ID, this.template.getTemplateSeq());
        componentItem.put(ItemConstants.COMPONENT_DATASET_ID, this.dataset.getDatasetSeq());
        componentItem.put(ItemConstants.COMPONENT_NAME, this.componentName);
        componentItem.put(ItemConstants.COMPONENT_DESCRIPTION, this.description);
        componentItem.put(ItemConstants.COMPONENT_PERIOD_YN, this.periodYn);
        componentItem.put(ItemConstants.COMPONENT_PERIOD_START_YMDT, this.periodStartDt.toString());
        componentItem.put(ItemConstants.COMPONENT_PERIOD_END_YMDT, this.periodEndDt.toString());
        componentItem.put(ItemConstants.COMPONENT_DATA_TYPE, this.dataType);
        componentItem.put(ItemConstants.COMPONENT_DEL_WORDS, this.delWords);
        componentItem.put(ItemConstants.COMPONENT_PAGING_YN, this.pagingYn);
        componentItem.put(ItemConstants.COMPONENT_PAGING_TYPE, this.pagingType);
        componentItem.put(ItemConstants.COMPONENT_PER_PAGE_COUNT, this.perPageCount);
        componentItem.put(ItemConstants.COMPONENT_MAX_PAGE_COUNT, this.maxPageCount);
        componentItem.put(ItemConstants.COMPONENT_DISP_PAGE_COUNT, this.dispPageCount);
        componentItem.put(ItemConstants.COMPONENT_MORE_COUNT, this.moreCount);
        componentItem.put(ItemConstants.COMPONENT_SEARCH_SERVICE_TYPE, this.schServiceType);
        componentItem.put(ItemConstants.COMPONENT_SEARCH_LANG, this.schLanguage);
        componentItem.put(ItemConstants.COMPONENT_SEARCH_CODE_ID, this.schCodeId);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_YN, this.snapshotYn);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_BODY, this.snapshotBody);
        componentItem.put(ItemConstants.COMPONENT_SKIN_ID, this.skin.getSkinSeq());
        return componentItem;
    }
}
