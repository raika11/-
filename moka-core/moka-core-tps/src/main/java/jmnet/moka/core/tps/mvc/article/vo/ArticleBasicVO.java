/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 기사정보
 */
@Alias("ArticleBasicVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleBasicVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 서비스기사아이디
     */
    private Long totalId;

    /**
     * 출처
     */
    private String sourceName;

    /**
     * 기사타입 코드
     */
    private String artType;

    /**
     * 기사썸네일
     */
    private String artThumb;

    /**
     * 등록기사 편집그룹 숫자
     */
    private Long artGroupNum;

    /**
     * 기사제목
     */
    private String artTitle;

    /**
     * 판
     */
    private String pressPan;

    /**
     * 면
     */
    private String pressMyun;

    /**
     * 출고일시
     */
    private Date serviceDatytime;

    /**
     * 수정일시
     */
    private Date artModDt;

    /**
     * 페이지편집 여부(Y/N)
     */
    @Builder.Default
    private String deskingYn = MokaConstants.NO;

    /**
     * 기자명
     */
    private String repName;

}
