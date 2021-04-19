package jmnet.moka.core.tps.mvc.abTest.vo;

import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * ABTest목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abTest.vo
 * ClassName : ABTestVO
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 09:54
 */

@Alias("ABTestCaseVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class ABTestCaseVO {

    /**
     * AB테스트일련번호
     */
    @Builder.Default
    @ApiModelProperty("AB테스트일련번호")
    private Long abTestSeq = 0l;

    /**
     * AB테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @ApiModelProperty("AB테스트 유형")
    private String abTestType;

    /**
     * AB테스트 목표(T:디자인 D:데이터)
     */
    @ApiModelProperty("AB테스트 목표")
    private String abTestPurpose;

    /**
     * 도메인ID
     */
    @ApiModelProperty("도메인ID")
    private String domainId;
    /**
     * 도메인ID명
     */
    @ApiModelProperty("도메인ID명")
    private String domainIdNm;

    /**
     * 페이지SEQ
     */
    @ApiModelProperty("페이지SEQ")
    private Long pageSeq = 0l;

    /**
     * 페이지명
     */
    @ApiModelProperty("페이지명")
    private String pageNm;

    /**
     * 영역일련번호(대안입력-디자인의 경우 영역으로 선택)
     */
    @ApiModelProperty("영역일련번호")
    private Long areaSeq = 0l;

    /**
     * 영역명
     */
    @ApiModelProperty("영역명")
    private String areaNm;

    /**
     * 컴포넌트SEQ
     */
    @ApiModelProperty("컴포넌트SEQ")
    private Long componentSeq = 0l;

    /**
     * 컴포넌트명
     */
    @ApiModelProperty("컴포넌트명")
    private String componentNm;

    /**
     * 뉴스레터SEQ
     */
    @ApiModelProperty("뉴스레터SEQ")
    private Long letterSeq = 0l;

    /**
     * 뉴스레터명
     */
    @ApiModelProperty("뉴스레터명")
    private String letterNm;

    /**
     * 시작일시
     */
    @ApiModelProperty("시작일시")
    private Date startDt;

    /**
     * 종료일시
     */
    @ApiModelProperty("종료일시")
    private Date endDt;

    /**
     * 목표달성기준(P:기간 K:KPI A:모두)
     */
    @ApiModelProperty("목표달성기준")
    private String endCondi;

    /**
     * 목표달성주기(JAM 수신기사의 경우 - 분단위)
     */
    @ApiModelProperty("목표달성주기")
    private Long endPeriod = 0l;

    /**
     * KPI달성 목표치(백분률(%))
     */
    @ApiModelProperty("KPI달성 목표치(백분률(%))")
    private Long endKpi = 0l;

    /**
     * KPI산정조건(클릭수)
     */
    @ApiModelProperty("KPI산정조건(클릭수)")
    private Long kpiClickCondi = 0l;

    /**
     * KPI산정조건(분)
     */
    @ApiModelProperty("KPI산정조건(분)")
    private Long kpiPeriodCondi = 0l;

    /**
     * 테스트 결과 자동반영여부
     */
    @ApiModelProperty("테스트 결과 자동반영여부")
    private String autoApplyYn;

    /**
     * 상태(임시T/진행Y/대기P/종료Q)
     */
    @ApiModelProperty("상태(임시T/진행Y/대기P/종료Q)")
    private String status;

    /**
     * 삭제여부
     */
    @ApiModelProperty("삭제여부")
    private String delYn;

    @ApiModelProperty("생성일자")
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 생성자
     */
    private String regId;

    @ApiModelProperty("수정일자")
    @DTODateTimeFormat
    private Date modDt;

    /**
     * 수정자
     */
    @ApiModelProperty("수정자")
    private String modId;

    /**
     * 로그인 여부(전체:`, 로그인:Y, 비로그인 : N)
     */
    @ApiModelProperty("로그인 여부(전체:`, 로그인:Y, 비로그인 : N)")
    private String loginYn;

    /**
     * 구독여부
     */
    @ApiModelProperty("구독여부")
    private String subscribeYn;

    /**
     * 구독상품SEQ
     */
    @ApiModelProperty("구독상품SEQ")
    private Long subscribeSeq = 0l;

    /**
     * 디바이스 구분(PC:P/Mobile:M/App:A/전체`) - 구분자콤마
     */
    @ApiModelProperty("디바이스 구분(PC:P/Mobile:M/App:A/전체`) - 구분자콤마")
    private String devDiv;

    /**
     * 브라우저(전체:`/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) - 구분자
     */
    @ApiModelProperty("브라우저(전체:`/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) - 구분자")
    private String browser;

    /**
     * 유입처(전체`/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) - 구분자콤마
     */
    @ApiModelProperty("유입처(전체`/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) - 구분자콤마")
    private String referer;

    /**
     * PWA설정여부
     */
    @ApiModelProperty("PWA설정여부")
    private String pwaYn;

    /**
     * 푸시설정여부
     */
    @ApiModelProperty("푸시설정여부")
    private String pushYn;

    /**
     * UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체`) - 구분자콤마
     */
    @ApiModelProperty("UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체`) - 구분자콤마")
    private String utm;

    /**
     * UTM SOURCE 태그
     */
    @ApiModelProperty("UTM SOURCE 태그")
    private String utmSource;

    /**
     * UTM MEDIUM 태그
     */
    @ApiModelProperty("UTM MEDIUM 태그")
    private String utmMedium;

    /**
     * UTM CAMPAIGN 태그
     */
    @ApiModelProperty("UTM CAMPAIGN 태그")
    private String utmCampaign;

    /**
     * UTM TERM 태그
     */
    @ApiModelProperty("UTM TERM 태그")
    private String utmTerm;

    /**
     * UTM CONTENT 태그
     */
    @ApiModelProperty("UTM CONTENT 태그")
    private String utmContent;

    /**
     * AB테스트제목
     */
    @ApiModelProperty("AB테스트제목")
    private String abTestTitle;

    /**
     * AB테스트설명
     */
    @ApiModelProperty("AB테스트설명")
    private String abTestDesc;
}
