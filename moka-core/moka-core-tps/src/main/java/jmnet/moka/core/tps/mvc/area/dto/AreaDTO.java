/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.page.dto.PageSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

/**
 * 편집영역 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "areaSeq")
@ApiModel("편집영역 DTO")
public class AreaDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<AreaDTO>>() {
    }.getType();

    @ApiModelProperty("영역일련번호")
    @Min(value = 0, message = "{tps.area.error.min.areaSeq}")
    private Long areaSeq;

    @ApiModelProperty("부모영역")
    @ToString.Exclude
    private ParentAreaDTO parent;

    @ApiModelProperty("뎁스")
    @Min(value = 0, message = "{tps.area.error.min.depth}")
    @Builder.Default
    private Integer depth = 1;

    @ApiModelProperty("출처")
    @NotNull(message = "{tps.area.error.notnull.sourceCode}")
    private String sourceCode;

    @ApiModelProperty("사용여부(Y:사용, N:미사용)")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.area.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("컴포넌트/컨테이너 사용여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.area.error.pattern.compYn}")
    private String compYn = MokaConstants.NO;

    @ApiModelProperty("페이지")
    private PageSimpleDTO page;

    @ApiModelProperty("영역구분(CP,CT)")
    @Pattern(regexp = "^(CP)|(CT)|()$", message = "{tps.area.error.pattern.areaDiv}")
    @Builder.Default
    private String areaDiv = MokaConstants.ITEM_COMPONENT;

    @ApiModelProperty("영역정렬:가로형H/세로형V")
    @Pattern(regexp = "[H|V]{1}$", message = "{tps.area.error.pattern.areaAlign}")
    @Builder.Default
    private String areaAlign = TpsConstants.AREA_ALIGN_V;

    @ApiModelProperty("컨테이너")
    private ContainerDTO container;

    @ApiModelProperty("순서")
    @Builder.Default
    private Integer ordNo = 1;

    @ApiModelProperty("영역명(필수)")
    @NotNull(message = "{tps.area.error.notnull.areaName}")
    @Pattern(regexp = ".+", message = "{tps.area.error.pattern.areaName}")
    @Length(min = 1, max = 128, message = "{tps.area.error.length.areaName}")
    private String areaNm;

    @ApiModelProperty("후속API 또는 함수")
    @Length(max = 256, message = "{tps.area.error.length.afterApi}")
    private String afterApi;

    @ApiModelProperty("미리보기리소스")
    @Length(max = 2000, message = "{tps.area.error.length.previewRsrc}")
    private String previewRsrc;

    @ApiModelProperty("컴포넌트목록: areaDiv == 'CT'인 경우 값 있음")
    private List<AreaCompDTO> areaComps = new ArrayList<AreaCompDTO>();

    @ApiModelProperty("컴포넌트: areaDiv == 'CP'인 경우 값 있음")
    private AreaCompDTO areaComp;

    public void addAreaComp(AreaCompDTO areaComp) {
        if (areaComp.getArea() == null) {
            areaComp.setArea(this);
            return;
        }

        if (areaComps == null) {
            areaComps = new ArrayList<AreaCompDTO>();
        }

        if (areaComps.contains(areaComp)) {
            return;
        } else {
            this.areaComps.add(areaComp);
        }
    }
}
