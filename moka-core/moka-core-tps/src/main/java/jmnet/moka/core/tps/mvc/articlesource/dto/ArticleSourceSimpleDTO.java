/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 간단 매체 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleSourceSimpleDTO")
@ApiModel("간단 기사 매체 DTO")
public class ArticleSourceSimpleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleSourceSimpleDTO>>() {
    }.getType();

    @ApiModelProperty("출처")
    private String sourceCode;

    @ApiModelProperty("출처명")
    private String sourceName;

}
