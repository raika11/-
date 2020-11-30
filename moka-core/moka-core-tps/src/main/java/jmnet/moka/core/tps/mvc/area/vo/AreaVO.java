/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-30
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@Alias("AreaVO")
public class AreaVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 영역일련번호
     */
    @Column(name = "AREA_SEQ")
    private Long areaSeq;

    /**
     * 영역명
     */
    @Column(name = "AREA_NM")
    private String areaNm;

    /**
     * 부모영역 SEQ
     */
    @Column(name = "PARENT_AREA_SEQ")
    @Builder.Default
    private Long parentAreaSeq = (long) 0;

    /**
     * 부모페이지명
     */
    @Column(name = "PARENT_AREA_NM")
    private String parentAreaNm;

    /**
     * 순서
     */
    @Column(name = "ORD_NO")
    private Integer ordNo = 1;

    /**
     * 영역구분(CP,CT)
     */
    @Column(name = "AREA_DIV")
    private String areaDiv = MokaConstants.ITEM_COMPONENT;

    /**
     * 영역정렬:가로형H/세로형V
     */
    @Column(name = "AREA_ALIGN")
    private String areaAlign = TpsConstants.AREA_ALIGN_V;

}
