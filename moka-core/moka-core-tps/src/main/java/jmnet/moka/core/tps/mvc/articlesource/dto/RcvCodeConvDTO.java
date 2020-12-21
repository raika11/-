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
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

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
    @NotNull(message = "{tps.rcv-code-conv.error.notnull.frCode}")
    @Length(min = 1, max = 32, message = "{tps.rcv-code-conv.error.length.frCode}")
    private String frCode;

    @ApiModelProperty("분류코드(필수)")
    @NotNull(message = "{tps.rcv-code-conv.error.notnull.toCode}")
    @Length(min = 1, max = 10, message = "{tps.rcv-code-conv.error.length.toCode}")
    private String toCode;

    @ApiModelProperty("매체")
    private ArticleSourceSimpleDTO articleSource;
}
