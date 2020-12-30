/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import jmnet.moka.core.tps.common.TpsConstants;
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
@Alias("ArticleHistoryDTO")
public class ArticleHistoryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleHistoryDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    private Long seqNo;

    /**
     * 서비스기사아이디
     */
    private Long totalId;

    /**
     * 마스터코드목록
     */
    private String masterCodeList;

    /**
     * 기사제목
     */
    private String artTitle;

    /**
     * 기사기자
     */
    private String artReporter;

    /**
     * 기사부제목
     */
    private String artSubTitle;

    /**
     * 키워드목록
     */
    private String keywordList;

    /**
     * 입력/수정/삭제 구분
     */
    private String iudDiv = TpsConstants.WORKTYPE_UPDATE;
}
