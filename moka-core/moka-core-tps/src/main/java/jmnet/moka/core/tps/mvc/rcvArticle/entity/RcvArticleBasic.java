/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.entity;

import java.io.Serializable;
import java.util.Date;
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
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.articlesource.entity.ArticleSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 수신기사 - 기본
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_RCV_ARTICLE_BASIC")
public class RcvArticleBasic implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 수신아이디
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RID", nullable = false)
    private Long rid;

    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID", nullable = false)
    @Builder.Default
    private Long totalId = (long) 0;

    /**
     * 등록기사아이디
     */
    @Column(name = "AID", nullable = false)
    @Builder.Default
    private Long aid = (long) 0;

    /**
     * 수신기사아이디
     */
    @Column(name = "RECEIVE_AID", nullable = false)
    private String receiveAid;

    /**
     * 매체
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "SOURCE_CODE", referencedColumnName = "SOURCE_CODE", nullable = false)
    private ArticleSource articleSource;

    /**
     * 미디어코드(연합만사용)
     */
    @Column(name = "MEDIA_CODE")
    private String mediaCode;

    /**
     * 제목
     */
    @Nationalized
    @Column(name = "TITLE")
    private String title;

    /**
     * 부제목
     */
    @Nationalized
    @Column(name = "SUB_TITLE")
    private String subTitle;

    /**
     * 출판일시
     */
    @Column(name = "PRESS_DT")
    private Date pressDt;

    /**
     * 엠바고시간
     */
    @Column(name = "EMBARGO_DT")
    private Date embargoDt;

    /**
     * 오프라인 신문 면번호
     */
    @Column(name = "MYUN")
    private String myun;

    /**
     * 오프라인 신문 판번호
     */
    @Column(name = "PAN")
    private String pan;

    /**
     * 긴급기사(연합만사용)
     */
    @Column(name = "URGENCY", columnDefinition = "char")
    private String urgency;

    /**
     * 지역명(연합만 사용)
     */
    @Column(name = "AREA")
    private String area;

    /**
     * 내용타입(01:제목,02:본문)(조판만 사용)
     */
    @Column(name = "PRESS_ART_TYPE")
    private String pressArtType;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false, columnDefinition = "char")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 포토여부
     */
    @Column(name = "PHOTO_YN", nullable = false, columnDefinition = "char")
    @Builder.Default
    private String photoYn = MokaConstants.NO;

    /**
     * 기사수정여부
     */
    @Column(name = "ART_EDIT_YN", nullable = false, columnDefinition = "char")
    @Builder.Default
    private String artEditYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 섹션구분(조판만 사용)
     */
    @Column(name = "SECTION", nullable = false)
    private String section = "0";

    /**
     * 저작권
     */
    @Column(name = "COPYRIGHT")
    private String copyright;

    /**
     * 서비스URL
     */
    @Column(name = "SERVICE_URL")
    private String serviceUrl;

    /**
     * 기사본문
     */
    @Nationalized
    @Column(name = "CONTENT")
    private String content;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.totalId = this.totalId == null ? 0 : this.totalId;
        this.aid = this.aid == null ? 0 : this.aid;
        this.usedYn = McpString.defaultValue(this.usedYn, MokaConstants.YES);
        this.photoYn = McpString.defaultValue(this.photoYn, MokaConstants.NO);
        this.artEditYn = McpString.defaultValue(this.artEditYn, MokaConstants.NO);
        this.section = McpString.defaultValue(this.section, "0");
    }
}
