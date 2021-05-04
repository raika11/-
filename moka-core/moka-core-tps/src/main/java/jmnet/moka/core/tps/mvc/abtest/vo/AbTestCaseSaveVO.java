package jmnet.moka.core.tps.mvc.abtest.vo;

import java.util.Date;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * ABTest목록 등록용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abtest.vo
 * ClassName : AbTestCaseSaveVO
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 09:54
 */

@Alias("AbTestCaseSaveVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AbTestCaseSaveVO {

    /**
     * ABTest 일련번호
     */
    @Column(name = "ABTEST_SEQ")
    private Integer abtestSeq;

    /**
     * AB테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @Column(name = "ABTEST_TYPE")
    private String abtestType;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID")
    private String domainId;

    /**
     * AB테스트 페이지(메인:M, 섹션: S, 기사(본문외):A, 뉴스레터:L)
     */
    @Column(name = "PAGE_TYPE")
    private String pageType;

    /**
     * 페이지SEQ 또는 기사타입 (기타코드 SVC_AT), 선택없을때는 ''
     */
    @Column(name = "PAGE_VALUE")
    private String pageValue;

    /**
     * 페이지SEQ 또는 기사타입 (기타코드 SVC_AT) 명
     */
    @Column(name = "PAGE_NM")
    private String pageNm;

    /**
     * 영역구분(A:영역,C:컴포넌트,L:뉴스레터,P:파티클)
     */
    @Column(name = "ZONE_DIV")
    private String zoneDiv;

    /**
     * 영역일련번호(AREA_SEQ,COMPONENT_SEQ,LETTER_SEQ,파티클구분(기타코드MC))
     */
    @Column(name = "ZONE_SEQ")
    private String zoneSeq;

    @Column(name = "ZONE_NM")
    private String zoneNm;

    /**
     * AB테스트 대상(TPLT:디자인,레터레이아웃 / DATA:데이터 / COMP:컴포넌트(메인탑디자인 및 본문외) / 레터제목:LTIT / 발송일시 / LSDT / 발송자명:LSNM)
     */
    @Column(name = "ABTEST_PURPOSE")
    private String abtestPurpose;

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
    private Long endPeriod = 0l;

    /**
     * KPI달성 목표치(백분률(%))
     */
    @Column(name = "END_KPI")
    private Long endKpi = 0l;

    /**
     * KPI산정조건(클릭수)
     */
    @Column(name = "KPI_CLICK_CONDI")
    private Long kpiClickCondi = 0l;

    /**
     * KPI산정조건(분)
     */
    @Column(name = "KPI_PERIOD_CONDI")
    private Long kpiPeriodCondi = 0l;

    /**
     * 테스트 결과 자동반영여부
     */
    @Column(name = "AUTO_APPLY_YN")
    private String autoApplyYn;

    /**
     * 상태(임시T/진행Y/대기P/종료Q)
     */
    @Column(name = "STATUS")
    private String status;

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN")
    private String delYn;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * AB테스트제목
     */
    @Column(name = "ABTEST_TITLE")
    private String abtestTitle;

    /**
     * AB테스트설명
     */
    @Column(name = "ABTEST_DESC")
    private String abtestDesc;

    /**
     * AB테스트 그룹생성 방식(R:랜덤, S:고정) / TB_ABTEST_GRP(AB테스트 그룹) ABTEST_GRP_METHOD
     */
    @Column(name = "ABTEST_GRP_METHOD")
    private String abtestGrpMethod;

    /**
     * AB테스트 그룹(랜덤:비율 / 고정:0~9숫자) / TB_ABTEST_GRP(AB테스트 그룹) ABTEST_GRP
     */
    @Column(name = "ABTEST_GRP_A")
    private String abtestGrpA;

    @Column(name = "ABTEST_GRP_B")
    private String abtestGrpB;

    /**
     * KPI달성율(A) / TB_ABTEST_INSTANCE(AB테스트 인스턴스)
     */
    @Column(name = "KPI_VALUE_A")
    private Long kpiValueA = 0L;

    /**
     * KPI달성율(B) / TB_ABTEST_INSTANCE(AB테스트 인스턴스)
     */
    @Column(name = "KPI_VALUE_B")
    private Long kpiValueB = 0L;

    /**
     * 서비스기사ID(JAM설계경우) / TB_ABTEST_INSTANCE(AB테스트 인스턴스)
     */
    @Column(name = "TOTAL_ID")
    private Long totalId;

    /**
     * 화면편집파트(T:제목,L:리드문,I:이미지,R;관련기사) / TB_ABTEST_INSTANCE(AB테스트 인스턴스)
     */
    @Column(name = "DESKING_PART")
    private String deskingPart;

    /**
     * VARIANT일련번호(템플릿SEQ/데이터셋SEQ/컴포넌트SEQ/컨테이너SEQ) / TB_ABTEST_VARIANT(AB테스트 VARIANT) VARIANT_SEQ
     */
    @Column(name = "VARIANT_SEQ_A")
    @Builder.Default
    private Long variantSeqA = 0l;

    @Column(name = "VARIANT_SEQ_B")
    @Builder.Default
    private Long variantSeqB = 0l;

    /**
     * 제목(JAM,뉴스레터), 뉴스레터 발송시간, 뉴스레터 발송자명   / TB_ABTEST_VARIANT(AB테스트 VARIANT) VARIANT_VALUE
     */
    @Column(name = "VARIANT_VALUE_A")
    private String variantValueA;

    @Column(name = "VARIANT_VALUE_B")
    private String variantValueB;

    /**
     * 기사내용
     */
    @Column(name = "ART_CONTENT_A")
    private String artContentA;

    @Column(name = "ART_CONTENT_B")
    private String artContentB;

    /**
     * 로그인 여부(전체:`, 로그인:Y, 비로그인 : N)
     */
    @Column(name = "LOGIN_YN")
    private String loginYn;

    /**
     * 구독여부
     */
    @Column(name = "SCB_YN")
    @Builder.Default
    private String scbYn = "N";

    /**
     * 구독상품SEQ
     */
    @Column(name = "SCB_NO")
    @Builder.Default
    private Long scbNo = 0l;

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
    private String pwaYn;

    /**
     * 푸시설정여부
     */
    @Column(name = "PUSH_YN")
    private String pushYn;

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
     * 중복 케이스 체크 컬럼
     */
    @Builder.Default
    private String dupChk = "Y";
}
