/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.cdnarticle.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * CDN 기사
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_CDN_ARTICLE")
public class CdnArticle extends RegAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 서비스기사아이디
     */
    @Id
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN")
    private String usedYn = MokaConstants.YES;

    /**
     * 설정 제목
     */
    @Nationalized
    @Column(name = "TITLE")
    private String title;

    /**
     * 설명 (히스토리)
     */
    @Column(name = "MEMO")
    private String memo;

    /**
     * 기사 CDN 웹URL
     */
    @Column(name = "CDN_URL_NEWS")
    private String cdnUrlNews;

    /**
     * 기사 CDN 모바일URL
     */
    @Column(name = "CDN_URL_MNEWS")
    private String cdnUrlMnews;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.usedYn = McpString.defaultValue(this.usedYn, MokaConstants.YES);
    }
}
