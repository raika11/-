/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이슈확장형 편집히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder(toBuilder = true)
@Alias("IssueDeskingHistDTO")
public class IssueDeskingHistDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<IssueDeskingHistDTO>>() {
    }.getType();


    private static final long serialVersionUID = 1L;

    @ApiModelProperty("일련번호")
    private Long seqNo;

    @ApiModelProperty("패키지 일련번호")
    private Long pkgSeq;

    @ApiModelProperty("컴포넌트번호(1-7)")
    private Integer compNo;

    @ApiModelProperty("노출여부")
    private String viewYn;

    @ApiModelProperty("상태 SAVE(임시) / PUBLISH(전송)")
    private String status;

    @ApiModelProperty("예약일시")
    private Date reserveDt;

    @ApiModelProperty("승인여부")
    private String approvalYn;

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
    private String duration;

    @ApiModelProperty("영상URL")
    private String vodUrl;

    @ApiModelProperty("발췌문")
    private String bodyHead;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile thumbFile;
}
