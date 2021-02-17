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
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
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
@Alias("ComponentWorkVO")
@ApiModel("컴포넌트워크 VO")
public class ComponentWorkVO implements Serializable {

    private static final long serialVersionUID = 2885110989383287296L;

    public static final Type TYPE = new TypeReference<List<ComponentWorkVO>>() {
    }.getType();

    @ApiModelProperty("컴포넌트워크 일련번호")
    @Column(name = "SEQ")
    private Long seq;

    @ApiModelProperty("컴포넌트SEQ")
    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    @ApiModelProperty("작업자ID")
    @Column(name = "REG_ID")
    private String regId;

    @ApiModelProperty("컴포넌트명")
    @Column(name = "COMPONENT_NAME")
    private String componentName;

    @ApiModelProperty("템플릿SEQ")
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    @ApiModelProperty("템플릿명")
    @Column(name = "TEMPLATE_NAME")
    private String templateName;

    @ApiModelProperty("크롭 가로")
    @Builder.Default
    private Integer cropWidth = 0;

    @ApiModelProperty("크롭 세로")
    @Builder.Default
    private Integer cropHeight = 0;

    //    @Column(name = "TEMPLATE_WIDTH")
    //    private Integer templateWidth;
    //
    //    @Column(name = "TEMPLATE_GROUP")
    //    private String templateGroup;

    @ApiModelProperty("데이타셋SEQ")
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @ApiModelProperty("데이터유형:NONE, DESK, AUTO, FORM")
    @Column(name = "DATA_TYPE")
    private String dataType;

    //    @Column(name = "ZONE")
    //    private String zone;
    //
    //    @Column(name = "MATCH_ZONE")
    //    private String matchZone;

    @ApiModelProperty("노출여부")
    @Column(name = "VIEW_YN")
    @Builder.Default
    private String viewYn = MokaConstants.YES;

    @ApiModelProperty("스냅샷여부")
    @Column(name = "SNAPSHOT_YN")
    @Builder.Default
    private String snapshotYn = MokaConstants.NO;

    @ApiModelProperty("스냅샷본문")
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    @ApiModelProperty("페이지당 건수")
    @Column(name = "PER_PAGE_COUNT")
    @Builder.Default
    private Integer perPageCount = TpsConstants.PER_PAGE_COUNT;

    @ApiModelProperty("컴포넌트순서")
    @Column(name = "COMPONENT_ORD")
    @Builder.Default
    private Integer componentOrd = 1;

    @ApiModelProperty("검색코드ID")
    @Column(name = "SCH_CODE_ID")
    private String schCodeId;

    //    @ApiModelProperty("기사페이지SEQ")
    //    @Column(name = "ART_PAGE_SEQ")
    //    private Long artPageSeq;

    @ApiModelProperty("파트SEQ")
    @Column(name = "PART_SEQ")
    private Long partSeq;

    @ApiModelProperty("서버기준 예약일자")
    @DTODateTimeFormat
    @Column(name = "RESERVE_DT")
    private Date reserveDt;

    @ApiModelProperty("임시저장 최종일시")
    @DTODateTimeFormat
    @Column(name = "LAST_SAVE_DT")
    private Date lastSaveDt;

    @ApiModelProperty("전송 최종일시")
    @DTODateTimeFormat
    @Column(name = "LAST_PUBLISH_DT")
    private Date lastPublishDt;

    @ApiModelProperty("편집기사워크 목록")
    @Builder.Default
    private List<DeskingWorkVO> deskingWorks = new ArrayList<DeskingWorkVO>();

    public ComponentItem toComponentItem() {
        ComponentItem componentItem = new ComponentItem();
        componentItem.put(ItemConstants.COMPONENT_ID, this.componentSeq);
        componentItem.put(ItemConstants.COMPONENT_TEMPLATE_ID, this.getTemplateSeq());
        componentItem.put(ItemConstants.COMPONENT_DATASET_ID, this.getDatasetSeq());
        componentItem.put(ItemConstants.COMPONENT_DATA_TYPE, this.dataType);
        componentItem.put(ItemConstants.COMPONENT_NAME, this.componentName);
        //componentItem.put(ItemConstants.COMPONENT_ZONE, this.zone);
        //componentItem.put(ItemConstants.COMPONENT_MATCH_ZONE, this.matchZone);
        componentItem.put(ItemConstants.COMPONENT_VIEW_YN, this.viewYn);
        componentItem.put(ItemConstants.COMPONENT_PER_PAGE_COUNT, this.perPageCount);
        componentItem.put(ItemConstants.COMPONENT_SEARCH_CODE_ID, this.schCodeId);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_YN, this.snapshotYn);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_BODY, this.snapshotBody);
        return componentItem;
    }
}
