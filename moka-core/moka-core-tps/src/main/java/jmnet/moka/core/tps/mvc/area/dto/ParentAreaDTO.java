/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 편집영역 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "areaSeq")
public class ParentAreaDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ParentAreaDTO>>() {
    }.getType();

    /**
     * 영역일련번호
     */
    @Min(value = 0, message = "{tps.area.error.min.areaSeq}")
    private Long areaSeq;

    /**
     * 영역명
     */
    @NotNull(message = "{tps.area.error.notnull.areaName}")
    @Pattern(regexp = ".+", message = "{tps.area.error.pattern.areaName}")
    @Length(min = 1, max = 128, message = "{tps.area.error.length.areaName}")
    private String areaNm;

}
