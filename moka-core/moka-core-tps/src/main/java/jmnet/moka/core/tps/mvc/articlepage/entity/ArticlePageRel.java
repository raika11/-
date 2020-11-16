/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 콘텐츠스킨관련정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "articlePage")
@Entity
@Table(name = "TB_WMS_ARTICLE_PAGE_REL")
public class ArticlePageRel implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ", nullable = false)
    private Long seq;

    /**
     * 기사페이지
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ART_PAGE_SEQ", referencedColumnName = "ART_PAGE_SEQ", nullable = false)
    private ArticlePage articlePage;
    /**
     * 도메인ID
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 관련유형 TP:템플릿, CP: 컴포넌트, AD:광고, CT:컨테이너, DS: 데이타셋
     */
    @Column(name = "REL_TYPE", nullable = false)
    private String relType;

    /**
     * 관련SEQ
     */
    @Column(name = "REL_SEQ", nullable = false)
    private Long relSeq;

    /**
     * 관련부모유형 NN :없음. CP: 컴포넌트, CT:컨테이너
     */
    @Column(name = "REL_PARENT_TYPE", nullable = false)
    @Builder.Default
    private String relParentType = TpsConstants.REL_TYPE_UNKNOWN;

    /**
     * 관련부모SEQ
     */
    @Column(name = "REL_PARENT_SEQ")
    private Long relParentSeq;

    /**
     * 관련순서
     */
    @Column(name = "REL_ORD", nullable = false)
    @Builder.Default
    private Integer relOrd = 1;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.relParentType = this.relParentType == null ? TpsConstants.REL_TYPE_UNKNOWN : this.relParentType;
        this.relOrd = this.relOrd == null ? 1 : this.relOrd;
    }

    public void setArticlePage(ArticlePage articlePage) {
        if (articlePage == null) {
            return;
        }
        this.articlePage = articlePage;
        this.articlePage.addArticlePageRel(this);
    }
}
