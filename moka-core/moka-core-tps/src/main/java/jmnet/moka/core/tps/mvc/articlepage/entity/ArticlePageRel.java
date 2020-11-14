/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * 콘텐츠스킨관련정보
 */
@Entity
@Table(name = "TB_WMS_ARTICLE_PAGE_REL")
@Data
public class ArticlePageRel implements Serializable {

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
     * 관련유형 TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋
     */
    @Column(name = "REL_TYPE", nullable = false)
    private String relType;

    /**
     * 관련SEQ
     */
    @Column(name = "REL_SEQ", nullable = false)
    private Integer relSeq;

    /**
     * 관련부모유형 NN :없음. CP: 컴포넌트, CT:컨테이너
     */
    @Column(name = "REL_PARENT_TYPE", nullable = false)
    private String relParentType = "NN";

    /**
     * 관련부모SEQ
     */
    @Column(name = "REL_PARENT_SEQ")
    private Integer relParentSeq;

    /**
     * 관련순서
     */
    @Column(name = "REL_ORD", nullable = false)
    private Integer relOrd = 1;

}
