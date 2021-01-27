/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.dto;

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
 * Description: 아젠다 카테고리 검색 DTO
 *
 * @author ssc
 * @since 2021-01-26
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("MicAgendaCateSearchDTO")
@ApiModel("아젠다 카테고리 검색 DTO")
public class MicAgendaCateSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 삭제된것까지 검색 포함 여부
     */
    @ApiModelProperty("삭제된것까지 검색 포함 여부 (Y/N)")
    private String includeDel;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public MicAgendaCateSearchDTO() {
        this.setUseTotal(MokaConstants.YES);
        this.includeDel = MokaConstants.NO;
    }
}
