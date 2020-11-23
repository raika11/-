/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 기사정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_ARTICLE_BASIC")
public class ArticleBasic implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 서비스기사아이디
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId;

    /**
     * 출처
     */
    @Column(name = "SOURCE_CODE", nullable = false)
    private String sourceCode;

    /**
     * 등록기사아이디
     */
    @Column(name = "AID", nullable = false)
    private Long aid;

    /**
     * 서비스일시(VC)
     */
    @Column(name = "SERVICE_DAYTIME", nullable = false)
    private Date serviceDaytime;

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
    @Nationalized
    @Column(name = "ART_REPORTER")
    private String artReporter;

    /**
     * 기사요약
     */
    @Nationalized
    @Column(name = "ART_SUMMARY")
    private String artSummary;

    /**
     * 기사썸네일
     */
    @Column(name = "ART_THUMB")
    private String artThumb;

    /**
     * 등록일시
     */
    @Column(name = "ART_REG_DT")
    private Date artRegDt;

    /**
     * 수정일시
     */
    @Column(name = "ART_MOD_DT")
    private Date artModDt;

    /**
     * 원본기사ID(복제시)
     */
    @Column(name = "ORG_ID", nullable = false)
    private Integer orgId = 0;

    /**
     * 기사타입
     */
    @Column(name = "ART_TYPE", columnDefinition = "char")
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

    /**
     * 콘텐트타입
     */
    @Column(name = "CONTENT_TYPE", columnDefinition = "char")
    private String contentType;

    /**
     * 서비스여부
     */
    @Column(name = "SERVICE_FLAG", columnDefinition = "char", nullable = false)
    private String serviceFlag = MokaConstants.NO;

    /**
     * 연결댓글ID
     */
    @Column(name = "CMT_TOTALID", nullable = false)
    private Long cmtTotalid = (long) 0;

    /**
     * 기사제목
     */
    @Nationalized
    @Column(name = "ART_TITLE")
    private String artTitle;

    /**
     * 기사부제목
     */
    @Nationalized
    @Column(name = "ART_SUB_TITLE")
    private String artSubTitle;

}
