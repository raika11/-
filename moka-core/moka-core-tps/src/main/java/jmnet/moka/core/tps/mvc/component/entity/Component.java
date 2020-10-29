package jmnet.moka.core.tps.mvc.component.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 컴포넌트
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT")
public class Component extends BaseAudit {

    private static final long serialVersionUID = 1003720414088222277L;

    public static final Type TYPE = new TypeReference<List<Component>>() {
    }.getType();

    /**
     * 컴포넌트SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    /**
     * 도메인
     */
    @ManyToOne
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 템플릿
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    /**
     * 데이타셋
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DATASET_SEQ", referencedColumnName = "DATASET_SEQ", nullable = true)
    private Dataset dataset;

    /**
     * 컴포넌트명
     */
    @Nationalized
    @Column(name = "COMPONENT_NAME", nullable = false)
    private String componentName;

    /**
     * 상세정보
     */
    @Nationalized
    @Column(name = "DESCRIPTION")
    private String description;

    /**
     * 기간여부
     */
    @Column(name = "PERIOD_YN", columnDefinition = "char")
    @Builder.Default
    private String periodYn = MokaConstants.NO;

    /**
     * 기간시작일
     */
    @Column(name = "PERIOD_START_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date periodStartDt;

    /**
     * 기간종료일
     */
    @Column(name = "PERIOD_END_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date periodEndDt;

    /**
     * 데이터유형:NONE, DESK, AUTO
     */
    @Column(name = "DATA_TYPE")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

    /**
     * 삭제단어-단어구분은 개행
     */
    @Nationalized
    @Column(name = "DEL_WORDS")
    private String delWords;

    /**
     * 영역
     */
    @Column(name = "ZONE")
    private String zone;

    /**
     * 매칭영역
     */
    @Column(name = "MATCH_ZONE")
    private String matchZone;

    /**
     * 페이징여부
     */
    @Column(name = "PAGING_YN", columnDefinition = "char")
    @Builder.Default
    private String pagingYn = MokaConstants.NO;

    /**
     * 페이징유형:N:이전/다음, M:더보기
     */
    @Column(name = "PAGING_TYPE", columnDefinition = "char")
    private String pagingType;

    /**
     * 페이지당 건수
     */
    @Column(name = "PER_PAGE_COUNT", nullable = false)
    @Builder.Default
    private Integer perPageCount = TpsConstants.PER_PAGE_COUNT;

    /**
     * 최대 페이지수
     */
    @Column(name = "MAX_PAGE_COUNT", nullable = false)
    @Builder.Default
    private Integer maxPageCount = TpsConstants.MAX_PAGE_COUNT;

    /**
     * 표출 페이지수
     */
    @Column(name = "DISP_PAGE_COUNT", nullable = false)
    @Builder.Default
    private Integer dispPageCount = TpsConstants.DISP_PAGE_COUNT;

    /**
     * 더보기 건수
     */
    @Column(name = "MORE_COUNT", nullable = false)
    @Builder.Default
    private Integer moreCount = TpsConstants.MORE_COUNT;

    /**
     * 검색서비스유형(기타코드)
     */
    @Column(name = "SCH_SERVICE_TYPE")
    private String schServiceType;

    /**
     * 검색언어(기타코드)
     */
    @Column(name = "SCH_LANG")
    @Builder.Default
    private String schLang = TpsConstants.DEFAULT_LANG;

    /**
     * 검색코드ID
     */
    @Column(name = "SCH_CODE_ID")
    private String schCodeId;

    /**
     * 스냅샷여부
     */
    @Column(name = "SNAPSHOT_YN", columnDefinition = "char")
    @Builder.Default
    private String snapshotYn = MokaConstants.NO;

    /**
     * 스냅샷본문
     */
    @Nationalized
    @Column(name = "SNAPSHOT_BODY")
    private String snapshotBody;

    //    /**
    //     * 스킨SEQ
    //     */
    //    @ManyToOne(fetch = FetchType.EAGER)
    //    @JoinColumn(name = "SKIN_SEQ", referencedColumnName = "SKIN_SEQ")
    //    private Skin skin;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.periodYn = McpString.defaultValue(this.periodYn, MokaConstants.NO);
        this.dataType = McpString.defaultValue(this.dataType, TpsConstants.DATATYPE_NONE);
        this.pagingYn = McpString.defaultValue(this.pagingYn, MokaConstants.NO);
        this.perPageCount = this.perPageCount == null ? TpsConstants.PER_PAGE_COUNT : this.perPageCount;
        this.maxPageCount = this.maxPageCount == null ? TpsConstants.MAX_PAGE_COUNT : this.maxPageCount;
        this.dispPageCount = this.dispPageCount == null ? TpsConstants.DISP_PAGE_COUNT : this.dispPageCount;
        this.moreCount = this.moreCount == null ? TpsConstants.MORE_COUNT : this.moreCount;
        this.schLang = McpString.defaultValue(this.schLang, TpsConstants.DEFAULT_LANG);
        this.snapshotYn = McpString.defaultValue(this.snapshotYn, MokaConstants.NO);
    }
}
