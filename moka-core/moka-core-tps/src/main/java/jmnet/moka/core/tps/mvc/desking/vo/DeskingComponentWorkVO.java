/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.desking.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Work 컴포넌트 정보 (편집기사 포함)
 *
 * @author ohtah
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@Alias("DeskingComponentWorkVO")
public class DeskingComponentWorkVO implements Serializable {

    private static final long serialVersionUID = 2885110989383287296L;

    public static final Type TYPE = new TypeReference<List<DeskingComponentWorkVO>>() {
    }.getType();

    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    @Column(name = "COMPONENT_NAME")
    private String componentName;

    @Column(name = "REG_ID")
    private String regId;

    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    @Column(name = "TEMPLATE_NAME")
    private String templateName;

    @Column(name = "TEMPLATE_WIDTH")
    private Integer templateWidth;

    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @Column(name = "DATA_TYPE")
    private String dataType;

    @Column(name = "ZONE")
    private String zone;

    @Column(name = "MATCH_ZONE")
    private String matchZone;

    @Column(name = "SNAPSHOT_YN")
    private String snapshotYn;

    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    @Column(name = "COMPONENT_ORD")
    private Long componentOrd;

    @Column(name = "SCH_CODE_ID")
    private String schCodeId;

    @Column(name = "ART_PAGE_SEQ")
    private Long artPageSeq;

    @Column(name = "VIEW_YN")
    private String viewYn;

    @Builder.Default
    private List<DeskingWorkVO> deskingWorks = new ArrayList<DeskingWorkVO>();

    public ComponentItem toComponentItem() {
        ComponentItem componentItem = new ComponentItem();
        componentItem.put(ItemConstants.COMPONENT_ID, this.componentSeq);
        // componentItem.put(ItemConstants.COMPONENT_DOMAIN_ID, this.domain.getDomainId());
        componentItem.put(ItemConstants.COMPONENT_TEMPLATE_ID, this.getTemplateSeq());
        componentItem.put(ItemConstants.COMPONENT_DATASET_ID, this.getDatasetSeq());
        componentItem.put(ItemConstants.COMPONENT_NAME, this.componentName);
        componentItem.put(ItemConstants.COMPONENT_DATA_TYPE, this.dataType);
        componentItem.put(ItemConstants.COMPONENT_SEARCH_CODE_ID, this.schCodeId);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_YN, this.snapshotYn);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_BODY, this.snapshotBody);
        componentItem.put(ItemConstants.COMPONENT_VIEW_YN, this.viewYn);
        return componentItem;
    }
}
