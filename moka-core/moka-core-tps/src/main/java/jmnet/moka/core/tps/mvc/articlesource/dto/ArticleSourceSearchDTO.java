/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * Description: 수신매체 검색 DTO
 *
 * @author ssc
 * @since 2020-12-29
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@ApiModel("수신매체 검색 DTO")
public class ArticleSourceSearchDTO extends SearchDTO {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("CP수신여부")
    private String rcvUsedYn;

    public ArticleSourceSearchDTO() {
        // 정렬 기본값을 설정
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        this.rcvUsedYn = TpsConstants.SEARCH_TYPE_ALL;
    }
}
