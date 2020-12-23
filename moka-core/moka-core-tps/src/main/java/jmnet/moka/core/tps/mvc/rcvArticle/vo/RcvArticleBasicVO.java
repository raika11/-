/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 수신기사VO
 *
 * @author ssc
 * @since 2020-12-22
 */
@Alias("RcvArticleBasicVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class RcvArticleBasicVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 수신아이디
     */
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

    //    /**
    //     * 수신기사아이디
    //     */
    //    @Column(name = "RECEIVE_AID", nullable = false)
    //    private Stringring receiveAid;

    /**
     * 매체코드
     */
    @Column(name = "SOURCE_CODE")
    private String sourceCode;

    /**
     * 매체명
     */
    @Column(name = "SOURCE_NAME")
    private String sourceName;

    //    /**
    //     * 미디어코드(연합만사용)
    //     */
    //    @Column(name = "MEDIA_CODE")
    //    private String mediaCode;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String title;

    //    /**
    //     * 부제목
    //     */
    //    @Column(name = "SUB_TITLE")
    //    private String subTitle;

    /**
     * 부서
     */
    @Column(name = "DEPART")
    private String depart;

    //    /**
    //     * 출판일시
    //     */
    //    @Column(name = "PRESS_DT")
    //    @DTODateTimeFormat
    //    private Date pressDt;

    //    /**
    //     * 엠바고시간
    //     */
    //    @Column(name = "EMBARGO_DT")
    //    @DTODateTimeFormat
    //    private Date embargoDt;
    //
    //    /**
    //     * 오프라인 신문 면번호
    //     */
    //    @Column(name = "MYUN")
    //    private String myun;
    //
    //    /**
    //     * 오프라인 신문 판번호
    //     */
    //    @Column(name = "PAN")
    //    private String pan;

    /**
     * 긴급기사(연합만사용)
     */
    @Column(name = "URGENCY", columnDefinition = "char")
    private String urgency;

    //    /**
    //     * 지역명(연합만 사용)
    //     */
    //    @Column(name = "AREA")
    //    private String area;
    //
    //    /**
    //     * 내용타입(01:제목,02:본문)(조판만 사용)
    //     */
    //    @Column(name = "PRESS_ART_TYPE")
    //    private String pressArtType;
    //
    //    /**
    //     * 사용여부
    //     */
    //    @Column(name = "USED_YN", nullable = false, columnDefinition = "char")
    //    @Builder.Default
    //    private String usedYn = MokaConstants.YES;

    //    /**
    //     * 포토여부
    //     */
    //    @Column(name = "PHOTO_YN", nullable = false, columnDefinition = "char")
    //    @Builder.Default
    //    private String photoYn = MokaConstants.NO;

    /**
     * 기사 URL
     */
    @Column(name = "COMP_URL")
    private String compUrl;

    //    /**
    //     * 기사수정여부
    //     */
    //    @Column(name = "ART_EDIT_YN", nullable = false, columnDefinition = "char")
    //    @Builder.Default
    //    private String artEditYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT", nullable = false)
    @DTODateTimeFormat
    private Date regDt;

    //    /**
    //     * 섹션구분(조판만 사용)
    //     */
    //    @Column(name = "SECTION", nullable = false)
    //    private String section = "0";
    //
    //    /**
    //     * 저작권
    //     */
    //    @Column(name = "COPYRIGHT")
    //    private String copyright;

    /**
     * 서비스URL
     */
    @Column(name = "SERVICE_URL")
    private String serviceUrl;

    //    /**
    //     * 기사본문
    //     */
    //    @Column(name = "CONTENT")
    //    private String content;

    /**
     * 서비스일시(등록기사일 경우)
     */
    @Column(name = "SERVICE_DAYTIME")
    @DTODateTimeFormat
    private Date serviceDaytime;
}
