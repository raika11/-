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
 * 시민마이크 피드 추가정보
 */
@Alias("MicAnswerRelVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicAnswerRelVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 관련 일련번호
     */
    @Min(value = 0, message = "{tps.answer-rel.error.min.answRelSeq}")
    @Column(name = "ANSW_REL_SEQ", nullable = false)
    private Long answRelSeq;

    /**
     * 답변일련번호
     */
    @NotNull(message = "{tps.answer-rel.error.notnull.answSeq}")
    @Column(name = "ANSW_SEQ", nullable = false)
    private Long answSeq;

    /**
     * 구분 (I:이미지, M:동영상, A:관련기사)
     */
    @NotNull(message = "{tps.answer-rel.error.notnull.relDiv}")
    @Pattern(regexp = "[I|M|A]{1}$", message = "{tps.answer-rel.error.pattern.relDiv}")
    @Column(name = "REL_DIV", nullable = false)
    private String relDiv;

    /**
     * 관련 URL
     */
    //    @NotNull(message = "{tps.answer-rel.error.notnull.relUrl}")
    @Length(max = 500, message = "{tps.answer-rel.error.len.relUrl}")
    @Column(name = "REL_URL", nullable = false)
    private String relUrl;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 관련기사 썸네일
     */
    @Length(max = 500, message = "{tps.answer-rel.error.len.artThumbnail}")
    @Column(name = "ART_THUMBNAIL")
    private String artThumbnail;

    /**
     * 관련기사 제목
     */
    //    @NotNull(message = "{tps.answer-rel.error.notnull.artTitle}")
    @Length(max = 510, message = "{tps.answer-rel.error.len.artTitle}")
    @Column(name = "ART_TITLE")
    private String artTitle;

    /**
     * 관련기사 요약
     */
    @Length(max = 500, message = "{tps.answer-rel.error.len.artSummary}")
    @Column(name = "ART_SUMMARY")
    private String artSummary;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile artThumbnailFile;
}
