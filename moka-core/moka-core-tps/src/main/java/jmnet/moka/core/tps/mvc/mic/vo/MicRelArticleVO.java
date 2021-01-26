/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

/**
 * 시민마이크 관련기사
 */
@Alias("MicRelArticleVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicRelArticleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 관련기사 일련번호
     */
    @Min(value = 0, message = "{tps.agenda-rel-article.error.min.artSeq}")
    @Column(name = "ART_SEQ", nullable = false)
    private Long artSeq;

    /**
     * 아젠다일련번호
     */
    @NotNull(message = "{tps.agenda-rel-article.error.notnull.agndSeq}")
    @Column(name = "AGND_SEQ", nullable = false)
    private Long agndSeq;

    /**
     * 서비스기사아이디
     */
    @NotNull(message = "{tps.agenda-rel-article.error.notnull.totalId}")
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId = (long) 0;

    /**
     * 관련기사 제목
     */
    @NotNull(message = "{tps.agenda-rel-article.error.notnull.artTitle}")
    @Length(max = 510, message = "{tps.agenda-rel-article.error.len.artTitle}")
    @Column(name = "ART_TITLE", nullable = false)
    private String artTitle;

    /**
     * 관련기사 썸네일
     */
    @Length(max = 500, message = "{tps.agenda-rel-article.error.len.artThumb}")
    @Column(name = "ART_THUMB")
    private String artThumb;

    @ApiModelProperty("관련기사 썸네일 파일")
    @JsonIgnore
    private MultipartFile artThumbFile;


}
