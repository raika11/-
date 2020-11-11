/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.entity;

import java.io.Serializable;
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
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * 편집영역컴포넌트
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "area")
@Entity
@Table(name = "TB_WMS_AREA_COMP")
public class AreaComp implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 영역
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "AREA_SEQ", referencedColumnName = "AREA_SEQ", nullable = false)
    private Area area;

    /**
     * 컴포넌트
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPONENT_SEQ", referencedColumnName = "COMPONENT_SEQ", nullable = false)
    private Component component;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 컴포넌트정렬 LEFT,RIGHT,NONE (NONE는 제외)
     */
    @Column(name = "COMP_ALIGN")
    @Builder.Default
    private String compAlign = TpsConstants.AREA_COMP_ALIGN_LEFT;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.ordNo = this.ordNo == null ? 1 : this.ordNo;
        this.compAlign = this.compAlign == null ? TpsConstants.AREA_COMP_ALIGN_LEFT : this.compAlign;
    }

    public void setArea(Area area) {
        if (area == null) {
            return;
        }
        this.area = area;
        this.area.addAreaComp(this);
    }
}
