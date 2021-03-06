package jmnet.moka.core.tps.mvc.component.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 컴포넌트DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("컴포넌트 DTO")
public class ComponentDTO implements Serializable {

    private static final long serialVersionUID = 7271351833690295727L;

    public static final Type TYPE = new TypeReference<List<ComponentDTO>>() {
    }.getType();

    @ApiModelProperty("컴포넌트SEQ")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}")
    private Long componentSeq;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("템플릿(필수)")
    @NotNull(message = "{tps.template.error.notnull.templateSeq}")
    private TemplateSimpleDTO template;

    @ApiModelProperty("데이타셋")
    private DatasetDTO dataset;

    @ApiModelProperty("에디트폼 파트")
    private EditFormPartDTO editFormPart;

    @ApiModelProperty("컴포넌트명")
    @NotNull(message = "{tps.component.error.notnull.componentName}")
    @Pattern(regexp = ".+", message = "{tps.component.error.pattern.componentName}")
    @Length(min = 1, max = 128, message = "{tps.component.error.length.componentName}")
    private String componentName;

    @ApiModelProperty("상세정보")
    @Length(max = 4000, message = "{tps.component.error.length.description}")
    private String description;

    @ApiModelProperty("기간여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.component.error.pattern.periodYn}")
    @Builder.Default
    private String periodYn = MokaConstants.NO;

    @ApiModelProperty("기간시작일")
    @DTODateTimeFormat
    private Date periodStartDt;

    @ApiModelProperty("기간종료일")
    @DTODateTimeFormat
    private Date periodEndDt;

    @ApiModelProperty("데이터유형:NONE, DESK, AUTO, FORM")
    @Pattern(regexp = "[(NONE)|(DESK)|(AUTO)|(FORM)]{4}$", message = "{tps.component.error.pattern.dataType}")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

    @ApiModelProperty("삭제단어-단어구분은 개행")
    @Length(max = 256, message = "{tps.component.error.length.delWords}")
    private String delWords;

    @ApiModelProperty("영역")
    @Length(max = 100, message = "{tps.component.error.length.zone}")
    private String zone;

    @ApiModelProperty("매칭영역")
    @Length(max = 50, message = "{tps.component.error.length.matchZone}")
    private String matchZone;

    @ApiModelProperty("노출여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.component.error.pattern.viewYn}")
    @Builder.Default
    private String viewYn = MokaConstants.YES;

    @ApiModelProperty("페이징여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.component.error.pattern.pagingYn}")
    @Builder.Default
    private String pagingYn = MokaConstants.NO;

    @ApiModelProperty("페이징유형:N:이전/다음, M:더보기")
    @Pattern(regexp = "[N|M]{1}$", message = "{tps.component.error.pattern.pagingType}")
    private String pagingType;

    @ApiModelProperty("페이지당 건수")
    @NotNull(message = "{tps.component.error.notnull.perPageCount}")
    @Builder.Default
    private Integer perPageCount = TpsConstants.PER_PAGE_COUNT;

    @ApiModelProperty("최대 페이지수")
    @NotNull(message = "{tps.component.error.notnull.maxPageCount}")
    @Builder.Default
    private Integer maxPageCount = TpsConstants.MAX_PAGE_COUNT;

    @ApiModelProperty("표출 페이지수")
    @NotNull(message = "{tps.component.error.notnull.dispPageCount}")
    @Builder.Default
    private Integer dispPageCount = TpsConstants.DISP_PAGE_COUNT;

    @ApiModelProperty("더보기 건수")
    @NotNull(message = "{tps.component.error.notnull.moreCount}")
    @Builder.Default
    private Integer moreCount = TpsConstants.MORE_COUNT;

    @ApiModelProperty("검색코드ID")
    @Length(max = 24, message = "{tps.component.error.length.schCodeId}")
    private String schCodeId;

    @ApiModelProperty("스냅샷여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.component.error.pattern.snapshotYn}")
    @Builder.Default
    private String snapshotYn = MokaConstants.NO;

    @ApiModelProperty("스냅샷 tems소스")
    private String snapshotBody;

    @ApiModelProperty("이전 자동데이타셋 : 디비에 없는 필드")
    private DatasetDTO prevAutoDataset;

    @ApiModelProperty("이전 수동데이타셋 : 디비에 없는 필드")
    private DatasetDTO prevDeskDataset;

    public ComponentItem toComponentItem() {
        ComponentItem componentItem = new ComponentItem();
        componentItem.put(ItemConstants.COMPONENT_ID, this.componentSeq);
        componentItem.put(ItemConstants.COMPONENT_DOMAIN_ID, this.domain.getDomainId());
        componentItem.put(ItemConstants.COMPONENT_TEMPLATE_ID, this.template.getTemplateSeq());
        componentItem.put(ItemConstants.COMPONENT_DATASET_ID, this.dataset != null ? this.dataset.getDatasetSeq() : null);
        componentItem.put(ItemConstants.COMPONENT_NAME, this.componentName);
        componentItem.put(ItemConstants.COMPONENT_DESCRIPTION, this.description);
        componentItem.put(ItemConstants.COMPONENT_PERIOD_YN, this.periodYn);
        componentItem.put(ItemConstants.COMPONENT_PERIOD_START_YMDT, this.periodStartDt);
        componentItem.put(ItemConstants.COMPONENT_PERIOD_END_YMDT, this.periodEndDt);
        componentItem.put(ItemConstants.COMPONENT_DATA_TYPE, this.dataType);
        componentItem.put(ItemConstants.COMPONENT_DEL_WORDS, this.delWords);
        componentItem.put(ItemConstants.COMPONENT_VIEW_YN, this.viewYn);
        componentItem.put(ItemConstants.COMPONENT_PAGING_YN, this.pagingYn);
        componentItem.put(ItemConstants.COMPONENT_PAGING_TYPE, this.pagingType);
        componentItem.put(ItemConstants.COMPONENT_PER_PAGE_COUNT, this.perPageCount);
        componentItem.put(ItemConstants.COMPONENT_MAX_PAGE_COUNT, this.maxPageCount);
        componentItem.put(ItemConstants.COMPONENT_DISP_PAGE_COUNT, this.dispPageCount);
        componentItem.put(ItemConstants.COMPONENT_MORE_COUNT, this.moreCount);
        componentItem.put(ItemConstants.COMPONENT_SEARCH_CODE_ID, this.schCodeId);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_YN, this.snapshotYn);
        componentItem.put(ItemConstants.COMPONENT_SNAPSHOT_BODY, this.snapshotBody);
        return componentItem;
    }
}
