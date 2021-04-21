/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.abtest.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A/B테스트 정의
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_ABTEST_CASE")
public class AbTestCase extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * A/B테스트 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ABTEST_SEQ", nullable = false)
    private Long abtestSeq;

    /**
     * A/B테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @Column(name = "ABTEST_TYPE")
    private String abtestType;

    /**
     * A/B테스트 목표(T:디자인 D:데이터)
     */
    @Column(name = "ABTEST_PURPOSE")
    private String abtestPurpose;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID")
    private String domainId;

    /**
     * 페이지SEQ
     */
    @Column(name = "PAGE_SEQ")
    @Builder.Default
    private Long pageSeq = 0l;

    /**
     * 영역일련번호(대안입력-디자인의 경우 영역으로 선택)
     */
    @Column(name = "AREA_SEQ")
    @Builder.Default
    private Long areaSeq = 0l;

    /**
     * 컴포넌트SEQ
     */
    @Column(name = "COMPONENT_SEQ")
    @Builder.Default
    private Long componentSeq = 0l;

    /**
     * 뉴스레터SEQ
     */
    @Column(name = "LETTER_SEQ")
    @Builder.Default
    private Long letterSeq = 0l;

    /**
     * 시작일시
     */
    @Column(name = "START_DT")
    private Date startDt;

    /**
     * 종료일시
     */
    @Column(name = "END_DT")
    private Date endDt;

    /**
     * 목표달성기준(P:기간 K:KPI A:모두)
     */
    @Column(name = "END_CONDI")
    private String endCondi;

    /**
     * 목표달성주기(JAM 수신기사의 경우 - 분단위)
     */
    @Column(name = "END_PERIOD")
    @Builder.Default
    private Long endPeriod = 0l;

    /**
     * KPI달성 목표치(백분률(%))
     */
    @Column(name = "END_KPI")
    @Builder.Default
    private Long endKpi = 0l;

    /**
     * KPI산정조건(클릭수)
     */
    @Column(name = "KPI_CLICK_CONDI")
    @Builder.Default
    private Long kpiClickCondi = 0l;

    /**
     * KPI산정조건(분)
     */
    @Column(name = "KPI_PERIOD_CONDI")
    @Builder.Default
    private Long kpiPeriodCondi = 0l;

    /**
     * 테스트 결과 자동반영여부
     */
    @Column(name = "AUTO_APPLY_YN")
    @Builder.Default
    private String autoApplyYn = "N";

    /**
     * 상태(임시T/진행Y/대기P/종료Q)
     */
    @Column(name = "STATUS")
    private String status;

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN")
    @Builder.Default
    private String delYn = "N";

    /**
     * 로그인 여부(전체:`, 로그인:Y, 비로그인 : N)
     */
    @Column(name = "LOGIN_YN")
    @Builder.Default
    private String loginYn = "";

    /**
     * 구독여부
     */
    @Column(name = "SUBSCRIBE_YN")
    @Builder.Default
    private String subscribeYn = "N";

    /**
     * 구독상품SEQ
     */
    @Column(name = "SUBSCRIBE_SEQ")
    @Builder.Default
    private Long subscribeSeq = 0l;

    /**
     * 디바이스 구분(PC:P/Mobile:M/App:A/전체`) - 구분자콤마
     */
    @Column(name = "DEV_DIV")
    private String devDiv;

    /**
     * 브라우저(전체:`/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) - 구분자
     */
    @Column(name = "BROWSER")
    private String browser;

    /**
     * 유입처(전체`/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) - 구분자콤마
     */
    @Column(name = "REFERER")
    private String referer;

    /**
     * PWA설정여부
     */
    @Column(name = "PWA_YN")
    @Builder.Default
    private String pwaYn = "N";

    /**
     * 푸시설정여부
     */
    @Column(name = "PUSH_YN")
    @Builder.Default
    private String pushYn = "N";

    /**
     * UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체`) - 구분자콤마
     */
    @Column(name = "UTM")
    private String utm;

    /**
     * UTM SOURCE 태그
     */
    @Column(name = "UTM_SOURCE")
    private String utmSource;

    /**
     * UTM MEDIUM 태그
     */
    @Column(name = "UTM_MEDIUM")
    private String utmMedium;

    /**
     * UTM CAMPAIGN 태그
     */
    @Column(name = "UTM_CAMPAIGN")
    private String utmCampaign;

    /**
     * UTM TERM 태그
     */
    @Column(name = "UTM_TERM")
    private String utmTerm;

    /**
     * UTM CONTENT 태그
     */
    @Column(name = "UTM_CONTENT")
    private String utmContent;

    /**
     * A/B테스트 제목
     */
    @Column(name = "ABTEST_TITLE")
    private String abtestTitle;

    /**
     * A/B테스트 설명
     */
    @Column(name = "ABTEST_DESC")
    private String abtestDesc;

}
