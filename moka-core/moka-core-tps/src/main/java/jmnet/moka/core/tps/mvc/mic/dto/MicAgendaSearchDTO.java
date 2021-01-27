/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
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
@Alias("MicAgendaSearchDTO")
@ApiModel("아젠다 검색 DTO")
public class MicAgendaSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 메뉴노출조건: 최상단(Y),비노출(N),전체(all)
     */
    @ApiModelProperty("메뉴노출조건")
    private String agndTop;

    @ApiModelProperty("시작일자")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty("종료일자")
    @DTODateTimeFormat
    private Date endDt;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public MicAgendaSearchDTO() {
        this.setUseTotal(MokaConstants.YES);
        this.agndTop = TpsConstants.SEARCH_TYPE_ALL;
    }
}
