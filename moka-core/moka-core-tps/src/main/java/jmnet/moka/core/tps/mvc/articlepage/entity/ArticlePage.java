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
 * 콘텐츠스킨
 */
@Entity
@Table(name = "TB_WMS_ARTICLE_PAGE")
@Data
public class ArticlePage implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 스킨SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ART_PAGE_SEQ", nullable = false)
    private Integer artPageSeq;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID", nullable = false)
    private String domainId;

    /**
     * 스킨명
     */
    @Column(name = "ART_PAGE_NAME", nullable = false)
    private String artPageName;

    /**
     * 서비스유형(기타코드)
     */
    @Column(name = "ART_TYPE")
    private String artType;

    /**
     * 스킨본문
     */
    @Column(name = "ART_PAGE_BODY")
    private String artPageBody;

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

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Timestamp modDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

}
