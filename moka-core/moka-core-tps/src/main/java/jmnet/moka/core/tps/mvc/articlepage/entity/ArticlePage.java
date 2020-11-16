/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlepage.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 콘텐츠스킨
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "articlePageRels")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "artPageSeq")
@Entity
@Table(name = "TB_WMS_ARTICLE_PAGE")
public class ArticlePage extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 기사페이지SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ART_PAGE_SEQ", nullable = false)
    private Long artPageSeq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 기사페이지명
     */
    @Nationalized
    @Column(name = "ART_PAGE_NAME", nullable = false)
    private String artPageName;

    /**
     * 서비스유형(기타코드)
     */
    @Column(name = "ART_TYPE")
    private String artType;

    /**
     * 카테고리
     */
    @Column(name = "CATEGORY")
    private String category;

    /**
     * 기사페이지본문
     */
    @Nationalized
    @Column(name = "ART_PAGE_BODY")
    @Builder.Default
    private String artPageBody = "";

    /**
     * 관련아이템
     */
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "articlePage", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    private Set<ArticlePageRel> articlePageRels = new LinkedHashSet<ArticlePageRel>();

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.artPageBody = McpString.defaultValue(this.artPageBody);
    }

    /**
     * 관련아이템 추가
     *
     * @param rel 관련아이템
     */
    public void addArticlePageRel(ArticlePageRel rel) {
        if (rel.getArticlePage() == null) {
            rel.setArticlePage(this);
            return;
        }

        if (articlePageRels.contains(rel)) {
            return;
        } else {
            this.articlePageRels.add(rel);
        }
    }

    /**
     * 관련아이템목록에서 type과 id가 동일한것이 있는지 검사한다.
     *
     * @param rel 관련아이템
     * @return 동일한게 있으면 true
     */
    public boolean isEqualRel(ArticlePageRel rel) {
        Optional<ArticlePageRel> find = articlePageRels.stream()
                                                       .filter(r -> {
                                                           if (r.getRelType()
                                                                .equals(rel.getRelType()) && r.getRelSeq()
                                                                                              .equals(rel.getRelSeq())) {
                                                               if (r.getRelParentSeq() == null && rel.getRelParentSeq() == null) {
                                                                   return true;
                                                               } else if (r.getRelParentSeq() == null && rel.getRelParentSeq() != null) {
                                                                   return false;
                                                               } else if (r.getRelParentSeq() != null && rel.getRelParentSeq() == null) {
                                                                   return false;
                                                               } else if (r.getRelParentSeq()
                                                                           .equals(rel.getRelParentSeq())) {
                                                                   return true;
                                                               }
                                                           }
                                                           return false;
                                                       })
                                                       .findFirst();
        if (find.isPresent()) {
            return true;
        }
        return false;
    }
}
