/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.code.ArticleCodeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 수신기사 - 분류코드
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_RCV_ARTICLE_CODE")
public class RcvArticleCode implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    @Builder.Default
    private RcvArticleCodePK id = new RcvArticleCodePK();

    /**
     * 코드명
     */
    @Column(name = "CODE_NAME")
    private String codeName;

    /**
     * 코드순서
     */
    @Column(name = "CODE_ORD", nullable = false)
    private Integer codeOrd = 1;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.codeOrd = this.codeOrd == null ? 1 : this.codeOrd;
        if (this.id.getCodeType() == null) {
            this.id.setCodeType(ArticleCodeType.MASTER_CODE);
        }
    }
}
