/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
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
 * @since 2021-01-26
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("MicAnswerSearchDTO")
@ApiModel("답변(포스트,피드) 검색 DTO")
public class MicAnswerSearchDTO extends SearchDTO {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "아젠다 순번", required = true)
    @Min(value = 0, message = "{tps.agenda.error.min.agndSeq}")
    @NotNull(message = "{tps.agenda.error.notnull.agndSeq}")
    private Long agndSeq;

    @ApiModelProperty("사용여부")
    private String usedYn;

    @ApiModelProperty("SNS로그인")
    private String loginSns;

    /**
     * 생성자: 검색 조건의 기본값을 설정
     */
    public MicAnswerSearchDTO() {
        this.setUseTotal(MokaConstants.YES);
    }
}
