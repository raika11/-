/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.dto;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-23
 */
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.articlesource.dto.ArticleSourceSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 수신기사정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("RcvArticleBasicDTO")
public class RcvArticleBasicDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<RcvArticleBasicDTO>>() {
    }.getType();

    /**
     * 수신아이디
     */
    private Long rid;

    /**
     * 서비스기사아이디
     */
    @Builder.Default
    private Long totalId = (long) 0;

    /**
     * 등록기사아이디
     */
    @Builder.Default
    private Long aid = (long) 0;

    /**
     * 수신기사아이디
     */
    private String receiveAid;

    /**
     * 매체
     */
    private ArticleSourceSimpleDTO articleSource;

    /**
     * 미디어코드(연합만사용)
     */
    private String mediaCode;

    /**
     * 제목
     */
    private String title;

    /**
     * 부제목
     */
    private String subTitle;

    /**
     * 부서
     */
    private String depart;

    /**
     * 출판일시
     */
    @DTODateTimeFormat
    private Date pressDt;

    /**
     * 엠바고시간
     */
    @DTODateTimeFormat
    private Date embargoDt;

    /**
     * 오프라인 신문 면번호
     */
    private String myun;

    /**
     * 오프라인 신문 판번호
     */
    private String pan;

    /**
     * 긴급기사(연합만사용)
     */
    private String urgency;

    /**
     * 지역명(연합만 사용)
     */
    private String area;

    /**
     * 내용타입(01:제목,02:본문)(조판만 사용)
     */
    private String pressArtType;

    /**
     * 사용여부
     */
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 포토여부
     */
    @Builder.Default
    private String photoYn = MokaConstants.NO;

    /**
     * 기사수정여부
     */
    @Builder.Default
    private String artEditYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 섹션구분(조판만 사용)
     */
    private String section = "0";

    /**
     * 저작권
     */
    @Column(name = "COPYRIGHT")
    private String copyright;

    /**
     * 서비스URL
     */
    private String serviceUrl;

    /**
     * 기사본문
     */
    private String content;
}
