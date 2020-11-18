/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 기사정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleBasicDTO")
public class ArticleBasicDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleBasicDTO>>() {
    }.getType();

    /**
     * 서비스기사아이디
     */
    private Long totalId;

    /**
     * 출처
     */
    private String sourceCode;

    /**
     * 등록기사아이디
     */
    private Long aid;

    /**
     * 서비스일시(VC)
     */
    @DTODateTimeFormat
    private Date serviceDaytime;

    /**
     * 출판일자
     */
    private String pressDate;

    /**
     * 판
     */
    private String pressPan;

    /**
     * 카테고리
     */
    private String pressCategory;

    /**
     * 면
     */
    private String pressMyun;

    /**
     * 번호
     */
    private String pressNumber;

    /**
     * 기사기자
     */
    private String articleReporter;

    /**
     * 기사요약
     */
    private String articleSummary;

    /**
     * 기사썸네일
     */
    private String articleThumb;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    private Date articleRegDt;

    /**
     * 수정일시
     */
    @DTODateTimeFormat
    private Date articleModDt;

    /**
     * 원본기사ID(복제시)
     */
    @Builder.Default
    private Integer orgId = 0;

    /**
     * 기사타입
     */
    @Builder.Default
    private String artType = "B";

    /**
     * 콘텐트타입
     */
    private String contentType;

    /**
     * 서비스여부
     */
    @Builder.Default
    private String serviceFlag = MokaConstants.NO;

    /**
     * 연결댓글ID
     */
    @Builder.Default
    private Long cmtTotalid = (long) 0;

    /**
     * 기사제목
     */
    private String articleTitle;

    /**
     * 기사부제목
     */
    private String articleSubTitle;
    
}
