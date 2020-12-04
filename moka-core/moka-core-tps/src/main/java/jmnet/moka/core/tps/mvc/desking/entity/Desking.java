/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 화면편집
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_DESKING")
public class Desking implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 화면편집SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DESKING_SEQ", nullable = false)
    private Long deskingSeq;

    /**
     * 데이터셋SEQ
     */
    @Column(name = "DATASET_SEQ", nullable = false)
    private Long datasetSeq;

    /**
     * 서비스기사아이디
     */
    @Column(name = "CONTENT_ID")
    private String contentId;

    /**
     * 부모 서비스기사아이디
     */
    @Column(name = "PARENT_CONTENT_ID")
    private String parentContentId;

    /**
     * 콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상
     */
    @Column(name = "CONTENT_TYPE", columnDefinition = "char")
    private String contentType;

    /**
     * 기사타입
     */
    @Column(name = "ART_TYPE", columnDefinition = "char")
    @Builder.Default
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

    /**
     * 출처
     */
    @Column(name = "SOURCE_CODE")
    private String sourceCode;

    /**
     * 콘텐트순서
     */
    @Column(name = "CONTENT_ORD", nullable = false)
    @Builder.Default
    private Integer contentOrd = 1;

    /**
     * 관련순서
     */
    @Column(name = "REL_ORD", nullable = false)
    @Builder.Default
    private Integer relOrd = 1;

    /**
     * 언어(기타코드)
     */
    @Column(name = "LANG", nullable = false)
    @Builder.Default
    private String lang = TpsConstants.DEFAULT_LANG;

    /**
     * 배부일시
     */
    @Column(name = "DIST_DT")
    private Date distDt;

    /**
     * 제목
     */
    @Nationalized
    @Column(name = "TITLE")
    private String title;

    /**
     * 제목/부제목 위치
     */
    @Column(name = "TITLE_LOC")
    private String titleLoc;

    /**
     * 제목크기
     */
    @Column(name = "TITLE_SIZE")
    private String titleSize;

    /**
     * 부제목
     */
    @Nationalized
    @Column(name = "SUB_TITLE")
    private String subTitle;

    /**
     * Box 제목
     */
    @Nationalized
    @Column(name = "NAMEPLATE")
    private String nameplate;

    /**
     * Box Url
     */
    @Column(name = "NAMEPLATE_URL")
    private String nameplateUrl;

    /**
     * Box target
     */
    @Column(name = "NAMEPLATE_TARGET")
    private String nameplateTarget;

    /**
     * 말머리
     */
    @Nationalized
    @Column(name = "TITLE_PREFIX")
    private String titlePrefix;

    /**
     * 말머리 위치
     */
    @Column(name = "TITLE_PREFIX_LOC")
    private String titlePrefixLoc;

    /**
     * 발췌문
     */
    @Nationalized
    @Column(name = "BODY_HEAD")
    private String bodyHead;

    /**
     * 링크URL
     */
    @Column(name = "LINK_URL")
    private String linkUrl;

    /**
     * 링크TARGET
     */
    @Column(name = "LINK_TARGET")
    private String linkTarget;

    /**
     * 썸네일파일명
     */
    @Column(name = "THUMB_FILE_NAME")
    private String thumbFileName;

    /**
     * 썸네일용량
     */
    @Column(name = "THUMB_SIZE", nullable = false)
    @Builder.Default
    private Integer thumbSize = 0;

    /**
     * 썸네일가로
     */
    @Column(name = "THUMB_WIDTH", nullable = false)
    @Builder.Default
    private Integer thumbWidth = 0;

    /**
     * 썸네일세로
     */
    @Column(name = "THUMB_HEIGHT", nullable = false)
    @Builder.Default
    private Integer thumbHeight = 0;

    /**
     * 화면편집생성일시 : wms_desking_work.regDt == wms_desking.deskingDt
     */
    @Column(name = "DESKING_DT")
    private Date deskingDt;

    /**
     * 생성일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 생성자
     */
    @Column(name = "REG_ID")
    private String regId;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.artType = McpString.defaultValue(TpsConstants.DEFAULT_ART_TYPE);
        this.contentOrd = this.contentOrd == null ? 1 : this.contentOrd;
        this.relOrd = this.relOrd == null ? 1 : this.relOrd;
        this.lang = this.lang == null ? TpsConstants.DEFAULT_LANG : this.lang;
        this.thumbSize = this.thumbSize == null ? 0 : this.thumbSize;
        this.thumbWidth = this.thumbWidth == null ? 0 : this.thumbWidth;
        this.thumbHeight = this.thumbHeight == null ? 0 : this.thumbHeight;
        this.regDt = McpDate.defaultValue(this.regDt);
    }
}
