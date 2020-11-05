/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

/**
 * msp-tps TemplateSearchDTO.java 2020. 2. 14. 오후 4:54:01 ssc
 */
package jmnet.moka.core.tps.mvc.area.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 편집영역 검색 DTO
 *
 * @author ssc
 * @since 2020. 2. 14. 오후 4:54:01
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("AreaSearchDTO")
public class AreaSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5900493133914418299L;

    private Integer depth;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public AreaSearchDTO() {
        super("ordNo,asc");
        this.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
    }
}
