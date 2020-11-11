/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * 편집영역
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "areaComps")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "areaSeq")
@Entity
@Table(name = "TB_WMS_AREA")
public class Area extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 영역일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AREA_SEQ", nullable = false)
    private Long areaSeq;

    /**
     * 부모영역
     */
    @ToString.Exclude   // self join시 문제가 있어 exclude
    @NotFound(action = NotFoundAction.IGNORE)   // https://eclipse4j.tistory.com/211
    @ManyToOne(fetch = FetchType.EAGER)         // OSVP일때는 EAGER로 한다.
    @JoinColumn(name = "PARENT_AREA_SEQ", referencedColumnName = "AREA_SEQ", nullable = true)
    private Area parent;

    /**
     * 뎁스
     */
    @Column(name = "DEPTH", nullable = false)
    @Builder.Default
    private Integer depth = 1;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 도메인
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 페이지
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PAGE_SEQ", referencedColumnName = "PAGE_SEQ")
    private Page page;

    /**
     * 영역구분(CP,CT)
     */
    @Column(name = "AREA_DIV")
    @Builder.Default
    private String areaDiv = MokaConstants.ITEM_COMPONENT;

    /**
     * 영역정렬:가로형H/세로형V
     */
    @Column(name = "AREA_ALIGN")
    @Builder.Default
    private String areaAlign = TpsConstants.AREA_ALIGN_V;

    /**
     * 컨테이너
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTAINER_SEQ", referencedColumnName = "CONTAINER_SEQ")
    private Container container;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 영역명
     */
    @Column(name = "AREA_NM", nullable = false)
    private String areaNm;

    /**
     * 미리보기리소스
     */
    @Column(name = "PREVIEW_RSRC")
    private String previewRsrc;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "area", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    //    @OneToMany(fetch = FetchType.LAZY, mappedBy = "area", cascade = {CascadeType.ALL})
    private Set<AreaComp> areaComps = new LinkedHashSet<AreaComp>();

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.depth = this.depth == null ? 1 : this.depth;
        this.usedYn = this.usedYn == null ? MokaConstants.YES : this.usedYn;
        this.areaDiv = this.areaDiv == null ? MokaConstants.ITEM_COMPONENT : this.areaDiv;
        this.areaAlign = this.areaAlign == null ? TpsConstants.AREA_ALIGN_V : this.areaAlign;
        this.ordNo = this.ordNo == null ? 1 : this.ordNo;
    }

    /**
     * 컴포넌트 추가
     *
     * @param comp 컴포넌트
     */
    public void addAreaComp(AreaComp comp) {
        if (comp.getArea() == null) {
            comp.setArea(this);
            return;
        }

        if (areaComps.contains(comp)) {
            return;
        } else {
            this.areaComps.add(comp);
        }
    }

    /**
     * 컴포넌트목록에서 id가 동일한것이 있는지 검사한다.
     *
     * @param comp 컴포넌트
     * @return 동일한게 있으면 true
     */
    public boolean isEqualComp(AreaComp comp) {
        Optional<AreaComp> find = areaComps.stream()
                                           .filter(c -> {
                                               if (c.getComponent()
                                                    .getComponentSeq() == comp.getComponent()
                                                                              .getComponentSeq()) {
                                                   return true;
                                               } else {
                                                   return false;
                                               }
                                           })
                                           .findFirst();
        if (find.isPresent()) {
            return true;
        }
        return false;
    }
}
