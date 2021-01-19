/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.validator.constraints.Length;

/**
 * CDN 기사
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("CDN기사 DTO")
public class CdnArticleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<CdnArticleDTO>>() {
    }.getType();

    @ApiModelProperty("서비스기사아이디(필수)")
    @NotNull(message = "{tps.cdn-article.error.notnull.totalId}")
    @Min(value = 0, message = "{tps.cdn-article.error.min.totalId}")
    private Long totalId;

    @ApiModelProperty("사용여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.cdn-article.error.pattern.usedYn}")
    private String usedYn = MokaConstants.YES;

    @Nationalized
    @ApiModelProperty("제목")
    @Length(max = 510, message = "{tps.cdn-article.error.length.title}")
    private String title;

    @ApiModelProperty("설명")
    @Length(max = 300, message = "{tps.cdn-article.error.length.memo}")
    private String memo;

    @ApiModelProperty("기사 CDN 웹URL")
    @Length(max = 100, message = "{tps.cdn-article.error.length.cdnUrlNews}")
    private String cdnUrlNews;

    @ApiModelProperty("기사 CDN 모바일URL")
    @Length(max = 100, message = "{tps.cdn-article.error.length.cdnUrlMnews}")
    private String cdnUrlMnews;

    @ApiModelProperty("등록일자")
    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty("등록자")
    private String regId;
}
