package jmnet.moka.core.tps.mvc.component.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.entity.RegAudit;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 컴포넌트 히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_HIST")
public class ComponentHist extends RegAudit {

    private static final long serialVersionUID = -5085329432096691213L;

    public static final Type TYPE = new TypeReference<List<ComponentHist>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 컴포넌트SEQ
     */
    @Column(name = "COMPONENT_SEQ", nullable = false)
    private Long componentSeq;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID", columnDefinition = "char", nullable = false)
    private String domainId;

    /**
     * 데이타셋
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATASET_SEQ")
    private Dataset dataset;

    /**
     * 템플릿
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    /**
     * 데이터유형:NONE, DESK, AUTO
     */
    @Column(name = "DATA_TYPE")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

    /**
     * 작업유형
     */
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    @Builder.Default
    private String workType = TpsConstants.WORKTYPE_UPDATE;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @Column(name = "STATUS", nullable = false)
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private EditStatusCode status = EditStatusCode.SAVE;

    /**
     * 예약일시
     */
    @Column(name = "RESERVE_DT", updatable = false)
    private Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Column(name = "APPROVAL_YN")
    @Builder.Default
    private String approvalYn = MokaConstants.NO;

    /**
     * 매칭영역 목록
     */
    @Column(name = "ZONE")
    private String zone;

    /**
     * 매칭영역
     */
    @Column(name = "MATCH_ZONE")
    private String matchZone;

    /**
     * 노출여부
     */
    @Column(name = "VIEW_YN", columnDefinition = "char")
    @Builder.Default
    private String viewYn = MokaConstants.YES;

    /**
     * 페이지당 건수
     */
    @Column(name = "PER_PAGE_COUNT", nullable = false)
    @Builder.Default
    private Integer perPageCount = TpsConstants.PER_PAGE_COUNT;

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

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.dataType = McpString.defaultValue(this.dataType, TpsConstants.DATATYPE_NONE);
        this.workType = McpString.defaultValue(this.workType, TpsConstants.WORKTYPE_UPDATE);
        this.status = this.status == null ? EditStatusCode.SAVE : this.status;
        this.approvalYn = McpString.defaultValue(this.approvalYn, MokaConstants.NO);
        this.viewYn = McpString.defaultValue(this.viewYn, MokaConstants.YES);
        this.perPageCount = this.perPageCount == null ? TpsConstants.PER_PAGE_COUNT : this.perPageCount;
    }
}
