/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
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
    @Column(name = "TOTAL_ID")
    private Long totalId;

    /**
     * 출처
     */
    @Column(name = "SOURCE_NAME")
    private String sourceName;

    /**
     * 기사타입 코드
     */
    @Column(name = "ART_TYPE")
    private String artType;

    /**
     * 기사타입 명
     */
    @Column(name = "ART_TYPE_NAME")
    private String artTypeName;

    /**
     * 기사썸네일
     */
    @Column(name = "ART_THUMB")
    private String artThumb;

    /**
     * 등록기사 편집그룹 숫자
     */
    @Column(name = "ART_GROUP_NUM")
    private Long artGroupNum;

    /**
     * 기사제목
     */
    @Column(name = "ART_TITLE")
    private String artTitle;

    /**
     * 판
     */
    @Column(name = "PRESS_PAN")
    private String pressPan;

    /**
     * 면
     */
    @Column(name = "PRESS_MYUN")
    private String pressMyun;

    /**
     * 출고일시
     */
    @Column(name = "SERVICE_DAYTIME")
    private Date serviceDatytime;

    /**
     * 수정일시
     */
    @Column(name = "ART_MOD_DT")
    private Date artModDt;

    /**
     * 페이지편집 여부(Y/N)
     */
    @Column(name = "DESKING_YN")
    @Builder.Default
    private String deskingYn = MokaConstants.NO;

    /**
     * 기자명
     */
    @Column(name = "ART_REPORTER")
    private String artReporter;

    /**
     * OVP동영상 첨부여부(DTL_CD = MJ)
     */
    @Column(name = "OVP_YN")
    private String ovpYn;

    /**
     * 유투브동영상 첨부여부(DTL_CD = MY)
     */
    @Column(name = "YOUTUBE_YN")
    private String youtubeYn;
}
