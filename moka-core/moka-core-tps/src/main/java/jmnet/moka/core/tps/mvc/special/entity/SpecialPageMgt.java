/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.special.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 특집페이지(디지털스페셜)
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_15RE_SPECIAL_PAGE_MGT")
public class SpecialPageMgt extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN")
    private String usedYn;

    /**
     * 회차
     */
    @Column(name = "ORDINAL", nullable = false)
    private Integer ordinal = 1;

    /**
     * 리스트여부
     */
    @Column(name = "LIST_YN")
    private String listYn = MokaConstants.YES;

    /**
     * 검색여부
     */
    @Column(name = "SCH_YN")
    private String schYn = MokaConstants.YES;

    /**
     * 검색키워드
     */
    @Nationalized
    @Column(name = "SCH_KWD")
    private String schKwd;

    /**
     * 페이지 태그(TB_15RE_CODE_MGT GRP_CD = PT 참조)
     */
    @Column(name = "PAGE_CD", nullable = false)
    private String pageCd;

    /**
     * 페이지 서비스 시작일(yyyyMMdd)
     */
    @Column(name = "PAGE_SDATE")
    private String pageSdate;

    /**
     * 페이지 서비스 종료일(yyyyMMdd)
     */
    @Column(name = "PAGE_EDATE")
    private String pageEdate;

    /**
     * 페이지 타이틀
     */
    @Nationalized
    @Column(name = "PAGE_TITLE")
    private String pageTitle;

    /**
     * PC URL
     */
    @Column(name = "PC_URL", nullable = false)
    private String pcUrl;

    /**
     * MOBILE URL
     */
    @Column(name = "MOB_URL", nullable = false)
    private String mobUrl;

    /**
     * 개발 담당자
     */
    @Column(name = "DEV_NAME")
    private String devName;

    /**
     * 개발 담당자 이메일
     */
    @Column(name = "DEV_EMAIL")
    private String devEmail;

    /**
     * 개발 담당자 연락처
     */
    @Column(name = "DEV_PHONE")
    private String devPhone;

    /**
     * 부서명
     */
    @Column(name = "REP_DEPT_NAME")
    private String repDeptName;

    /**
     * 이미지URL
     */
    @Column(name = "IMG_URL")
    private String imgUrl;

    /**
     * 페이지 설명
     */
    @Nationalized
    @Column(name = "PAGE_DESC")
    private String pageDesc;

    /**
     * 구글 AD센스태그
     */
    @Column(name = "GOOGLE_TAG")
    private String googleTag;

    /**
     * 조인스 DA 점태그
     */
    @Column(name = "JOINSAD_TAG")
    private String joinsadTag;

    /**
     * 조인스 DA 점태그-모바일
     */
    @Column(name = "JOINSAD_TAG_MOB")
    private String joinsadTagMob;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.usedYn = McpString.defaultValue(this.usedYn, MokaConstants.YES);
        this.ordinal = this.ordinal == null ? 1 : this.ordinal;
        this.listYn = McpString.defaultValue(this.listYn, MokaConstants.YES);
        this.schYn = McpString.defaultValue(this.schYn, MokaConstants.YES);
    }
}
