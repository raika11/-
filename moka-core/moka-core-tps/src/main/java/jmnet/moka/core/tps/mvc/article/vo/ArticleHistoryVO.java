/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 기사히스토리
 *
 * @author ssc
 * @since 2020-12-30
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleHistoryVO")
public class ArticleHistoryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleHistoryVO>>() {
    }.getType();

    /**
     * 일련번호
     */
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
    @Column(name = "ART_TITLE")
    private String artTitle;

    /**
     * 기사기자
     */
    @Column(name = "ART_REPORTER")
    private String artReporter;

    /**
     * 기사부제목
     */
    @Column(name = "ART_SUB_TITLE")
    private String artSubTitle;

    /**
     * 키워드목록
     */
    @Column(name = "KEYWORD_LIST")
    private String keywordList;

    /**
     * 입력/수정/삭제 구분
     */
    @Column(name = "IUD_DIV", columnDefinition = "char")
    private String iudDiv = TpsConstants.WORKTYPE_UPDATE;

    /**
     * 작업일자
     */
    @Column(name = "REG_DT")
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 작업자ID
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 작업자명
     */
    @Column(name = "REG_NAME")
    private String regName;
}
