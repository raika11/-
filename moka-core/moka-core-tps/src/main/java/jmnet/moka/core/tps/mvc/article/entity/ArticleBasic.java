/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * 기사정보
 */
@Entity
@Table(name = "TB_ARTICLE_BASIC")
@Data
public class ArticleBasic implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 서비스기사아이디
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TOTAL_ID", nullable = false)
    private Integer totalId;

    /**
     * 출처
     */
    @Column(name = "SOURCE_CODE", nullable = false)
    private String sourceCode;

    /**
     * 등록기사아이디
     */
    @Column(name = "AID", nullable = false)
    private Integer AID;

    /**
     * 서비스일시(VC)
     */
    @Column(name = "SERVICE_DAYTIME", nullable = false)
    private String serviceDaytime;

    /**
     * 출판일자
     */
    @Column(name = "PRESS_DATE")
    private String pressDate;

    /**
     * 판
     */
    @Column(name = "PRESS_PAN")
    private String pressPan;

    /**
     * 카테고리
     */
    @Column(name = "PRESS_CATEGORY")
    private String pressCategory;

    /**
     * 면
     */
    @Column(name = "PRESS_MYUN")
    private String pressMyun;

    /**
     * 번호
     */
    @Column(name = "PRESS_NUMBER")
    private String pressNumber;

    /**
     * 기사기자
     */
    @Column(name = "ARTICLE_REPORTER")
    private String articleReporter;

    /**
     * 기사요약
     */
    @Column(name = "ARTICLE_SUMMARY")
    private String articleSummary;

    /**
     * 기사썸네일
     */
    @Column(name = "ARTICLE_THUMB")
    private String articleThumb;

    /**
     * 등록일시
     */
    @Column(name = "ARTICLE_REG_DT")
    private Timestamp articleRegDt;

    /**
     * 수정일시
     */
    @Column(name = "ARTICLE_MOD_DT")
    private Timestamp articleModDt;

    /**
     * 원본기사ID(복제시)
     */
    @Column(name = "ORG_ID", nullable = false)
    private Integer orgId = 0;

    /**
     * 기사타입
     */
    @Column(name = "ART_TYPE")
    private String artType = "B";

    /**
     * 콘텐트타입
     */
    @Column(name = "CONTENT_TYPE")
    private String contentType;

    /**
     * 서비스여부
     */
    @Column(name = "SERVICE_FLAG", nullable = false)
    private String serviceFlag = "N";

    /**
     * 연결댓글ID
     */
    @Column(name = "CMT_TOTALID", nullable = false)
    private Integer cmtTotalid = 0;

    /**
     * 호
     */
    @Column(name = "HO", nullable = false)
    private Integer HO = 0;

    /**
     * 기사제목
     */
    @Column(name = "ARTICLE_TITLE")
    private String articleTitle;

    @Column(name = "ARTICLE_SUB_TITLE")
    private String articleSubTitle;

}
