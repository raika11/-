/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-17
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("편집기사워크 DTO")
public class DeskingWorkDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<DeskingWorkDTO>>() {
    }.getType();

    @ApiModelProperty("편집기사워크 일련번호")
    private Long seq;

    @ApiModelProperty("화면편집SEQ")
    private Integer deskingSeq;

    @ApiModelProperty("데이터셋SEQ")
    private Long datasetSeq;

    @ApiModelProperty("서비스기사아이디")
    private String contentId;

    @ApiModelProperty("부모 서비스기사아이디. 있을경우 관련기사")
    private String parentContentId;

    @ApiModelProperty("채널타입(기사A/영상M/패키지I/기자R/칼럼니스트C)")
    private String channelType;

    @ApiModelProperty("콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상")
    private String contentType;

    @ApiModelProperty("기사타입")
    @Builder.Default
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

    @ApiModelProperty("매체코드")
    private String sourceCode;

    @ApiModelProperty("콘텐트순서")
    @Builder.Default
    private Integer contentOrd = 1;

    @ApiModelProperty("관련순서")
    @Builder.Default
    private Integer relOrd = 1;

    @ApiModelProperty("언어(기타코드)")
    @Builder.Default
    private String lang = TpsConstants.DEFAULT_LANG;

    @ApiModelProperty("배부일시")
    @DTODateTimeFormat
    private Date distDt;

    @ApiModelProperty("제목")
    private String title;

    @ApiModelProperty("제목/부제목 위치")
    private String titleLoc;

    @ApiModelProperty("제목크기")
    private String titleSize;

    @ApiModelProperty("부제목")
    private String subTitle;

    @ApiModelProperty("Box 제목")
    private String nameplate;

    @ApiModelProperty("Box Url")
    private String nameplateUrl;

    @ApiModelProperty("Box target")
    private String nameplateTarget;

    @ApiModelProperty("말머리")
    private String titlePrefix;

    @ApiModelProperty("말머리 위치")
    private String titlePrefixLoc;

    @ApiModelProperty("발췌문")
    private String bodyHead;

    @ApiModelProperty("링크URL")
    private String linkUrl;

    @ApiModelProperty("링크TARGET")
    private String linkTarget;

    @ApiModelProperty("썸네일파일명")
    private String thumbFileName;

    @ApiModelProperty("썸네일용량")
    @Builder.Default
    private Integer thumbSize = 0;

    @ApiModelProperty("썸네일가로")
    @Builder.Default
    private Integer thumbWidth = 0;

    @ApiModelProperty("썸네일세로")
    @Builder.Default
    private Integer thumbHeight = 0;

    @ApiModelProperty("생성일시")
    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty("생성자")
    private String regId;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile thumbnailFile;

    @ApiModelProperty("컴포넌트SEQ")
    private Long componentSeq;

    @ApiModelProperty("영상URL")
    private String vodUrl;

    @ApiModelProperty("아이콘파일명")
    private String iconFileName;

    @ApiModelProperty("중요도")
    private String contentPriority;

    @ApiModelProperty("재생시간")
    private String duration;
}
