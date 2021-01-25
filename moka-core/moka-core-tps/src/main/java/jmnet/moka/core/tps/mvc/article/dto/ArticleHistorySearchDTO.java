/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 히스토리 검색조건 DTO
 *
 * @author ssc
 * @since 2021-01-25
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ArticleHistorySearchDTO")
@ApiModel("기사 히스토리 검색 DTO")
public class ArticleHistorySearchDTO extends SearchDTO {

    @ApiModelProperty("기사키")
    private Long totalId;

    public ArticleHistorySearchDTO() {
        super.setUseTotal(MokaConstants.YES);
    }
}
