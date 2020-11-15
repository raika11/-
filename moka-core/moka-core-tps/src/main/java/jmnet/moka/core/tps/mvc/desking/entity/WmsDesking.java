/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.desking.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * 화면편집
 */
@Entity
@Table(name = "TB_WMS_DESKING")
@Data
public class WmsDesking implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 화면편집SEQ
     */
    @Id
    @Column(name = "DESKING_SEQ", nullable = false)
    private Integer deskingSeq;

    /**
     * 데이터셋SEQ
     */
    @Column(name = "DATASET_SEQ", nullable = false)
    private Integer datasetSeq;

    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID")
    private Integer totalId;

    /**
     * 부모 서비스기사아이디
     */
    @Column(name = "PARENT_TOTAL_ID")
    private Integer parentTotalId;

    /**
     * 콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상
     */
    @Column(name = "CONTENT_TYPE")
    private String contentType;

    /**
     * 콘텐트순서
     */
    @Column(name = "CONTENT_ORD", nullable = false)
    private Integer contentOrd = 1;

    /**
     * 관련순서
     */
    @Column(name = "REL_ORD", nullable = false)
    private Integer relOrd = 1;

    /**
     * 언어(기타코드)
     */
    @Column(name = "LANG", nullable = false)
    private String LANG = "KR";

    /**
     * 배부일시
     */
    @Column(name = "DIST_DT")
    private Timestamp distDt;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String TITLE;

    /**
     * 모바일제목
     */
    @Column(name = "MOB_TITLE")
    private String mobTitle;

    /**
     * 부제목
     */
    @Column(name = "SUB_TITLE")
    private String subTitle;

    /**
     * 어깨제목
     */
    @Column(name = "NAMEPLATE")
    private String NAMEPLATE;

    /**
     * 말머리
     */
    @Column(name = "TITLE_PREFIX")
    private String titlePrefix;

    /**
     * 발췌문
     */
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
     * 더보기URL
     */
    @Column(name = "MORE_URL")
    private String moreUrl;

    /**
     * 더보기TARGET
     */
    @Column(name = "MORE_TARGET")
    private String moreTarget;

    /**
     * 썸네일파일명
     */
    @Column(name = "THUMB_FILE_NAME")
    private String thumbFileName;

    /**
     * 썸네일용량
     */
    @Column(name = "THUMB_SIZE", nullable = false)
    private Integer thumbSize = 0;

    /**
     * 썸네일가로
     */
    @Column(name = "THUMB_WIDTH", nullable = false)
    private Integer thumbWidth = 0;

    /**
     * 썸네일세로
     */
    @Column(name = "THUMB_HEIGHT", nullable = false)
    private Integer thumbHeight = 0;

    /**
     * 화면편집생성일시
     */
    @Column(name = "DESKING_DT")
    private Timestamp deskingDt;

    /**
     * 생성일시
     */
    @Column(name = "REG_DT")
    private Timestamp regDt;

    /**
     * 생성자
     */
    @Column(name = "REG_ID")
    private String regId;

}
