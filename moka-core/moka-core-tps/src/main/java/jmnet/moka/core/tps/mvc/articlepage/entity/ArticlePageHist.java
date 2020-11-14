/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.entity;

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
 * 콘텐츠스킨히스토리
 */
@Entity
@Data
@Table(name = "TB_WMS_ARTICLE_PAGE_HIST")
public class ArticlePageHist implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ", nullable = false)
    private Integer SEQ;

    /**
     * 스킨SEQ
     */
    @Column(name = "ART_PAGE_SEQ", nullable = false)
    private Integer artPageSeq;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID", nullable = false)
    private String domainId;

    /**
     * 스킨본문
     */
    @Column(name = "ART_PAGE_BODY")
    private String artPageBody;

    /**
     * 작업유형
     */
    @Column(name = "WORK_TYPE")
    private String workType = "U";

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Timestamp regDt;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    private String regId;

}
