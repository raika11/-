/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

/**
 * 이슈확장형 편집정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder(toBuilder = true)
@Alias("IssueDeskingDTO")
public class IssueDeskingDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<IssueDeskingDTO>>() {
    }.getType();


    private static final long serialVersionUID = 1L;

    @ApiModelProperty("일련번호")
    private Long seqNo;

    @ApiModelProperty("패키지 일련번호")
    private Long pkgSeq;

    @ApiModelProperty("컴포넌트번호(1-7)")
    private Long compNo;

    @ApiModelProperty("콘텐츠ID")
    private String contentsId;

    @ApiModelProperty("콘텐츠순서")
    private Integer contentsOrd;

    @ApiModelProperty("채널타입(기사A/사진P/라이브L/영상M/키워드K/차트G)")
    private String channelType;

    @DTODateTimeFormat
    @ApiModelProperty("배부일시")
    private Date distDt;

    @ApiModelProperty("제목")
    private String title;

    @ApiModelProperty("링크URL")
    private String linkUrl;

    @ApiModelProperty("링크TARGET")
    private String linkTarget;

    @ApiModelProperty("썸네일파일명")
    private String thumbFileName;

    @ApiModelProperty("썸네일용량")
    private Integer thumbSize;

    @ApiModelProperty("썸네일가로")
    private Integer thumbWidth;

    @ApiModelProperty("썸네일세로")
    private Integer thumbHeight;

    @ApiModelProperty("배경색상")
    private String bgColor;

    @ApiModelProperty("재생시간")
    private String DURATION;

    @ApiModelProperty("발췌문")
    private String bodyHead;

}
