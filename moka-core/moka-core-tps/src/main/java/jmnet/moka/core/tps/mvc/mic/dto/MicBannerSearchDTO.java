/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-01-26
 */
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("MicBannerSearchDTO")
@ApiModel("배너 검색 DTO")
public class MicBannerSearchDTO extends SearchDTO {
    private static final long serialVersionUID = 1L;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public MicBannerSearchDTO() {
        this.setUseTotal(MokaConstants.YES);
    }
}
