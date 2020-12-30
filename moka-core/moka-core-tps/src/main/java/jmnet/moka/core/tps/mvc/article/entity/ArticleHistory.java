/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 기사수정 히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_ARTICLE_HISTORY")
public class ArticleHistory extends RegAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID", nullable = false)
    private Long totalId;

    /**
     * 마스터코드목록
     */
    @Column(name = "MASTER_CODE_LIST")
    private String masterCodeList;

    /**
     * 기사제목
     */
    @Nationalized
    @Column(name = "ART_TITLE")
    private String artTitle;

    /**
     * 기사기자
     */
    @Nationalized
    @Column(name = "ART_REPORTER")
    private String artReporter;

    /**
     * 기사부제목
     */
    @Nationalized
    @Column(name = "ART_SUB_TITLE")
    private String artSubTitle;

    /**
     * 키워드목록
     */
    @Nationalized
    @Column(name = "KEYWORD_LIST")
    private String keywordList;

    /**
     * 입력/수정/삭제 구분
     */
    @Column(name = "IUD_DIV", columnDefinition = "char")
    private String iudDiv = TpsConstants.WORKTYPE_UPDATE;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.iudDiv = McpString.defaultValue(this.iudDiv, TpsConstants.WORKTYPE_UPDATE);
    }


}
