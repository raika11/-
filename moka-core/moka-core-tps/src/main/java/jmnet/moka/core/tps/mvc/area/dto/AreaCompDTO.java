/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 편집영역컴포넌트 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AreaCompDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<AreaCompDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.areaComp.error.min.seqNo}")
    private Long seqNo;

    /**
     * 영역
     */
    @NotNull(message = "{tps.area.error.notnull.areaSeq}")
    private AreaDTO area;

    /**
     * 컴포넌트
     */
    @NotNull(message = "{tps.component.error.notnull.componentSeq}")
    private ComponentSimpleDTO component;

    /**
     * 순서
     */
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 컴포넌트정렬 LEFT,RIGHT,NONE (NONE는 제외)
     */
    @Pattern(regexp = "^(LEFT)|(RIGHT)|(NONE)|()$", message = "{tps.areaComp.error.pattern.compAlign}")
    @Builder.Default
    private String compAlign = TpsConstants.AREA_COMP_ALIGN_LEFT;

    /**
     * 화면편집파트
     */
    @Length(max = 512, message = "{tps.areaComp.error.length.deskingPart}")
    private String deskingPart;

    public void setArea(AreaDTO area) {
        if (area == null) {
            return;
        }
        this.area = area;
        this.area.addAreaComp(this);
    }
}
