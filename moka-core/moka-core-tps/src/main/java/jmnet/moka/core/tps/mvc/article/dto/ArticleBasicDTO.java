/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBulkSimpleVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleContentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleReporterVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleServiceVO;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSimpleDTO;
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
     * 수신기사아이디
     */
    private Long rid;

    /**
     * 출처
     */
    private String sourceCode;

    /**
     * 출처
     */
    private ArticleSourceSimpleDTO articleSource;

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
     * 지면 면별 기사 위치(번호)
     */
    private String pressPosition;

    /**
     * 기사기자
     */
    private String artReporter;

    /**
     * 기사요약
     */
    private String artSummary;

    /**
     * 기사썸네일
     */
    private String artThumb;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    private Date artRegDt;

    /**
     * 수정일시
     */
    @DTODateTimeFormat
    private Date artModDt;

    /**
     * 원본기사ID(복제시)
     */
    @Builder.Default
    private Long orgId = (long) 0;

    /**
     * 기사타입
     */
    @Builder.Default
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

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
     * 엠바고 [Y/N]
     */
    private String embargo;

    /**
     * 통합CMS ID
     */
    private Long jamId;

    /**
     * 통합CMS ORG ID
     */
    private Long jamOrgId;

    /**
     * 기사제목
     */
    private String artTitle;

    /**
     * 분류코드 목록
     */
    private List<String> categoryList = new ArrayList<>();

    /**
     * 기자 목록
     */
    private List<ArticleReporterVO> reporterList = new ArrayList<>();

    /**
     * 추천태그 목록
     */
    private List<String> tagList = new ArrayList<>();

    /**
     * 벌크사이트 목록
     */
    private List<ArticleBulkSimpleVO> bulkSiteList = new ArrayList<>();

    /**
     * 본문
     */
    private ArticleContentVO artContent;

    /**
     * 기사부제목
     */
    private String artSubTitle;

    /**
     * 기사 서비스 정보
     */
    private ArticleServiceVO articleService;
}
