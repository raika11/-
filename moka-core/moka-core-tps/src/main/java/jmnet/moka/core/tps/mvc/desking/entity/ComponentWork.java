/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.desking.entity;

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
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
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
 * 화면편집 작업 컴포넌트
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_WORK")
public class ComponentWork extends RegAudit {

    private static final long serialVersionUID = 2072557439143903488L;

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
     * 템플릿
     */
    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ", referencedColumnName = "TEMPLATE_SEQ", nullable = false)
    private Template template;

    /**
     * 데이타셋
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATASET_SEQ", referencedColumnName = "DATASET_SEQ")
    private Dataset dataset;

    /**
     * 데이터유형:NONE, DESK, AUTO, FORM
     */
    @Column(name = "DATA_TYPE")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

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

    /**
     * 컴포넌트순서
     */
    @Column(name = "COMPONENT_ORD", nullable = false)
    @Builder.Default
    private Integer componentOrd = 1;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.dataType = this.dataType == null ? TpsConstants.DATATYPE_NONE : this.dataType;
        this.snapshotYn = McpString.defaultValue(this.snapshotYn, MokaConstants.NO);
        this.componentOrd = this.componentOrd == null ? 1 : this.componentOrd;
    }
}
