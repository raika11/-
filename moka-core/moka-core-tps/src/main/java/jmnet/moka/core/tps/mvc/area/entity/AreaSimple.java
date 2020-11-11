/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.entity;

import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 편집영역
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AreaSimple extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 영역일련번호
     */
    @Column(name = "AREA_SEQ", nullable = false)
    private Long areaSeq;

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

}
