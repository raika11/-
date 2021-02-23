/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

/**
 * msp-tps TemplateSearchDTO.java 2020. 2. 14. 오후 4:54:01 ssc
 */
package jmnet.moka.core.tps.mvc.area.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
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
@ApiModel("편집영역 검색 DTO")
public class AreaSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 5900493133914418299L;

    @ApiModelProperty("부모 편집영역 일련번호")
    private Long parentAreaSeq;

    @ApiModelProperty("도메인")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    @ApiModelProperty("출처")
    @NotNull(message = "{tps.area.error.notnull.sourceCode}")
    private String sourceCode;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public AreaSearchDTO() {
        super("ordNo,asc");
        this.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
    }
}
