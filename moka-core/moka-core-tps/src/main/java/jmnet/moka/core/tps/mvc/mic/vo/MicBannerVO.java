/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
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
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

/**
 * 시민마이크 다른주제공통배너
 */
@Alias("MicBannerVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicBannerVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 베너일련번호
     */
    @Min(value = 0, message = "{tps.banner.error.min.bnnrSeq}")
    @Column(name = "BNNR_SEQ", nullable = false)
    private Long bnnrSeq;

    /**
     * 링크 URL
     */
    @NotNull(message = "{tps.banner.error.notnull.linkUrl}")
    @Length(max = 200, message = "{tps.agenda.error.len.linkUrl}")
    @Column(name = "LINK_URL", nullable = false)
    private String linkUrl;

    /**
     * 이미지 경로
     */
    @NotNull(message = "{tps.banner.error.notnull.imgLink}")
    @Length(max = 200, message = "{tps.banner.error.len.imgLink}")
    @Column(name = "IMG_LINK", nullable = false)
    private String imgLink;

    /**
     * 사용여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.banner.error.pattern.usedYn}")
    @Column(name = "USED_YN", nullable = false)
    @Builder.Default
    private String usedYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    @ApiModelProperty("배너이미지파일")
    @JsonIgnore
    private MultipartFile imgFile;
}
