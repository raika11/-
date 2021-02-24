/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * Description: 조판 검색 DTO
 *
 * @author ssc
 * @since 2021-02-18
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("RcvArticleJiSearchDTO")
@ApiModel("조판 검색 DTO")
public class RcvArticleJiSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("섹션")
    @Length(max = 5, message = "{tps.rvc-articlej.error.length.section}")
    private String section;

    @ApiModelProperty("조판일자")
    @DTODateTimeFormat
    private Date pressDate;

    @ApiModelProperty("호")
    private Integer ho;

    @ApiModelProperty("면")
    @Length(max = 2, message = "{tps.rvc-articlej.error.length.myun}")
    @Pattern(regexp = "[0-9]*$", message = "{tps.rcv-articlej.error.pattern.myun}")
    private String myun;

    @ApiModelProperty("매체코드")
    private String sourceCode;

    @ApiModelProperty("수정버전")
    private String revision;

    public RcvArticleJiSearchDTO() {
        this.sourceCode = TpsConstants.SEARCH_TYPE_ALL;
        this.section = TpsConstants.SEARCH_TYPE_ALL;
        this.revision = TpsConstants.SEARCH_TYPE_ALL;
    }

}
