/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Alias("PackageVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PackageVO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<PackageVO>>() {
    }.getType();

    /**
     * 패키지 일련번호
     */
    @Column(name = "PKG_SEQ", nullable = false)
    private Long pkgSeq;

    /**
     * 사용 여부(Y:사용, R:예약, N:미사용)
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn;

    /**
     * 패키지 유형(T:토픽, I:이슈, S:시리즈)
     */
    @Column(name = "PKG_DIV", nullable = false)
    private String pkgDiv;

    /**
     * 시즌 넘버
     */
    @Column(name = "SEASON_NO")
    private String seasonNo;

    /**
     * 회차표시(0:없음, 1:1회차, P:프롤로그)
     */
    @Column(name = "EPIS_VIEW")
    private String episView;

    /**
     * 구독 가능 여부
     */
    @Column(name = "SCB_YN")
    private String scbYn;

    /**
     * 구독상품 일련번호
     */
    @Column(name = "SCB_NO")
    private Long scbNo;

    /**
     * 기사 수
     */
    @Column(name = "ARTICLE_COUNT")
    private Integer artCnt;

    /**
     * 최근 기사1
     */
    @Column(name = "TOTAL_ID1")
    private Long totalId1;

    /**
     * 카테고리 리스트
     */
    @Column(name = "CAT_LIST")
    private String catList;

    /**
     * 패키지 타이틀
     */
    @Column(name = "PKG_TITLE")
    private String pkgTitle;

    /**
     * 패키지 설명
     */
    @Column(name = "PKG_DESC")
    private String pkgDesc;

    /**
     * 추천 패키지 리스트(,로 구분)
     */
    @Column(name = "RECOMM_PKG")
    private String recommPkg;

    /**
     * 에약일시
     */
    @DTODateTimeFormat
    @Column(name = "RESERV_DT")
    private Date reservDt;

    /**
     * 최종 업데이트 일시
     */
    @DTODateTimeFormat
    @Column(name = "UPD_DT")
    private Date updDt;

    /**
     * 담당기자목록 ({id|name},)
     */
    @Column(name = "REP_LIST")
    private String repList;

    /**
     * 생성일
     */
    @Column(name = "REG_DT")
    private String regDt;

    /**
     * 최신기사 업데이트
     */
    @DTODateTimeFormat
    @Column(name = "LAST_ARTIBLE_UPDATE_DATE")
    private Date lastArticleUpdateDate;
}
