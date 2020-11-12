/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 기사정보
 */
@Alias("ArticleBasicVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleBasicVO implements Serializable {

    private static final long serialVersionUID = 1L;

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
    private Long AID;

    /**
     * 서비스일시(VC)
     */
    private String serviceDaytime;

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
    private Date articleRegDt;

    /**
     * 수정일시
     */
    private Date articleModDt;

    /**
     * 원본기사ID(복제시)
     */
    @Builder.Default
    private Long orgId = (long) 0;

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
     * 호
     */
    @Builder.Default
    private Integer HO = 0;

    /**
     * 기사제목
     */
    private String articleTitle;

    /**
     * 기사부제목
     */
    private String articleSubTitle;

}
