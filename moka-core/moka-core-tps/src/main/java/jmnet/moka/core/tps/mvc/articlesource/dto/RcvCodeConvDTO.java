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
 * Description: 매체 매핑코드 DTO
 *
 * @author ssc
 * @since 2020-12-18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("RcvCodeConvDTO")
@ApiModel("매체 매핑코드 DTO")
public class RcvCodeConvDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<RcvCodeConvDTO>>() {
    }.getType();

    @ApiModelProperty("일련번호")
    private Long seqNo;

    @ApiModelProperty("CP 분류코드(필수)")
    private String frCode;

    @ApiModelProperty("Jam 분류코드(필수)")
    private String toCode;

    @ApiModelProperty("Jam 분류코드PRIME")
    private String toCodePrime;

    @ApiModelProperty("코드타입")
    private String codeType;

    @ApiModelProperty("JAM중분류코드")
    private String sectcode;

    @ApiModelProperty("매체")
    private ArticleSourceSimpleDTO articleSource;
}
