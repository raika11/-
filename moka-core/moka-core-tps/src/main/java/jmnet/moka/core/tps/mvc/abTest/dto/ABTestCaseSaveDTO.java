package jmnet.moka.core.tps.mvc.abTest.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abTest.dto
 * ClassName : ABTestCaseSaveDTO
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 12:04
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("ABTest 정의 DTO")
public class ABTestCaseSaveDTO {
    public static final Type TYPE = new TypeReference<List<jmnet.moka.core.tps.mvc.board.dto.BoardInfoDTO>>() {
    }.getType();

    /**
     * ` AB테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @ApiModelProperty("AB테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)")
    @NotNull(message = "{tps.abTest.error.notnull.abTestType}")
    @Pattern(regexp = "[A|E|J|B|L]{1}$", message = "{tps.abTest.error.pattern.abTestType}")
    private String abTestType;

    /**
     * AB테스트 목표(T:디자인 D:데이터)
     */
    @ApiModelProperty("AB테스트 목표(T:디자인 D:데이터)")
    @NotNull(message = "{tps.abTest.error.notnull.abTestPurpose}")
    @Pattern(regexp = "[T|D]{1}$", message = "{tps.abTest.error.pattern.abTestPurpose}")
    private String abTestPurpose;

    /**
     * 도메인 아이디
     */
    @ApiModelProperty("도메인 아이디(필수)")
    @NotNull(message = "{tps.domain.error.pattern.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    /**
     * 페이지SEQ
     */
    @ApiModelProperty("페이지SEQ")
    @Min(value = 0, message = "{tps.page.error.min.pageSeq}")
    private Long pageSeq;

    /**
     * 영역일련번호
     */
    @ApiModelProperty("영역일련번호")
    @Min(value = 0, message = "{tps.area.error.min.areaSeq}")
    private Long areaSeq;

    /**
     * 컴포넌트SEQ
     */
    @ApiModelProperty("컴포넌트SEQ")
    @Min(value = 0, message = "{tps.component.error.min.componentSeq}")
    private Long componentSeq;

    /**
     * 뉴스레터SEQ
     */
    @ApiModelProperty("뉴스레터SEQ")
    @Min(value = 0, message = "{tps.abTest.error.min.letterSeq}")
    private Long letterSeq;

    /**
     * 시작일시
     */
    @ApiModelProperty("시작일시")
    @DTODateTimeFormat
    private Date startDt;

    /**
     * 종료일시
     */
    @ApiModelProperty("종료일시")
    @DTODateTimeFormat
    private Date endDt;

    /**
     * 목표달성기준(P:기간 K:KPI A:모두)
     */
    @ApiModelProperty("목표달성기준(P:기간 K:KPI A:모두)")
    @Pattern(regexp = "[P|K|A]{1}$", message = "{tps.abTest.error.pattern.endCondi}")
    private String endCondi;

    /**
     * 목표달성주기(JAM 수신기사의 경우 - 분단위)
     */
    @ApiModelProperty("목표달성주기(JAM 수신기사의 경우 - 분단위)")
    @NotNull(message = "{tps.abTest.error.notnull.endPeriod}")
    @Pattern(regexp = "[P|K|A]{1}$", message = "{tps.abTest.error.pattern.endPeriod}")
    private String endPeriod;

    /**
     * KPI달성 목표치(백분률(%)
     */
    @ApiModelProperty("KPI달성 목표치(백분률(%)")
    @Builder.Default
    @NotNull(message = "{tps.abTest.error.notnull.endKpi}")
    @Min(value = 0, message = "{tps.abTest.error.min.endKpi}")
    private Long endKpi = 0L;

    /**
     * KPI산정조건(클릭수)
     */
    @ApiModelProperty("KPI산정조건(클릭수)")
    @Builder.Default
    @NotNull(message = "{tps.abTest.error.notnull.kpiClickCondi}")
    @Min(value = 0, message = "{tps.abTest.error.min.kpiClickCondi}")
    private Long kpiClickCondi = 0L;

    /**
     * KPI산정조건(분)
     */
    @ApiModelProperty("KPI산정조건(분)")
    @Builder.Default
    @NotNull(message = "{tps.abTest.error.notnull.kpiPeriodCondi}")
    @Min(value = 0, message = "{tps.abTest.error.min.kpiPeriodCondi}")
    private Long kpiPeriodCondi = 0L;

    /**
     * 테스트 결과 자동반영여부
     */
    @ApiModelProperty("테스트 결과 자동반영여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.answYn}")
    private String autoApplyYn = MokaConstants.NO;

    /**
     * 상태(임시T/진행Y/대기P/종료Q)
     */
    @ApiModelProperty("상태(임시T/진행Y/대기P/종료Q)")
    @NotNull(message = "{tps.abTest.error.notnull.status}")
    @Pattern(regexp = "[T|Y|P|Q]{1}$", message = "{tps.abTest.error.pattern.status}")
    private String status;

    /**
     * 삭제여부
     */
    @ApiModelProperty("삭제여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.answYn}")
    private String delYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    @Builder.Default
    private Date regDt = new Date();

    /**
     * 생성자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정일시
     */
    @ApiModelProperty(value = "수정일시", hidden = true)
    @DTODateTimeFormat
    private Date modDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

    /**
     * 로그인 여부(전체:', 로그인:Y, 비로그인 : N)
     */
    @ApiModelProperty("로그인 여부(전체:', 로그인:Y, 비로그인 : N)")
    private String loginYn;

    /**
     * 구독여부
     */
    @ApiModelProperty("구독여부")
    @Builder.Default
    private String subscribeYn = MokaConstants.NO;

    /**
     * 구독상품SEQ
     */
    @ApiModelProperty("구독상품SEQ")
    @Builder.Default
    @NotNull(message = "{tps.abTest.error.notnull.subscribeSeq}")
    @Min(value = 0, message = "{tps.abTest.error.min.subscribeSeq}")
    private Long subscribeSeq = 0L;

    /**
     * 디바이스 구분(PC:P/Mobile:M/App:A/전체') - 구분자콤마
     */
    @ApiModelProperty(value = "디바이스 구분(PC:P/Mobile:M/App:A/전체' : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.devDiv}")
    private String devDiv;

    /**
     * 브라우저(전체:'/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) - 구분자콤마
     */
    @ApiModelProperty(value = "브라우저(전체:'/IE:IE/Chrome:CRM/Edge:EDG/Safari:SAF/안드로이드웹:AW/삼성IE:SIE/기타:ETC) : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.devDiv}")
    private String browser;

    /**
     * 유입처(전체'/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) - 구분자콤마
     */
    @ApiModelProperty(value = "유입처(전체'/네이버:NAVER/구글:GOOGLE/카카오:KAKAO/트위터:TWITTER/기타:ETC) : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.referer}")
    private String referer;

    /**
     * PWA설정여부
     */
    @ApiModelProperty("PWA설정여부")
    @Builder.Default
    private String pwaeYn = MokaConstants.NO;

    /**
     * 푸시설정여부
     */
    @ApiModelProperty("푸시설정여부")
    @Builder.Default
    private String pushYn = MokaConstants.NO;

    /**
     * UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체') - 구분자콤마
     */
    @ApiModelProperty(value = "UTM(SOURCE/MEDIUM/CAMPAIGN/TERM/CONTENT/전체')  : 텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 50, message = "{tps.abTest.error.size.utm}")
    private String utm;

    /**
     * UTM SOURCE 태그
     */
    @ApiModelProperty(value = "UTM SOURCE 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmSource}")
    private String utmSource;

    /**
     * UTM MEDIUM 태그
     */
    @ApiModelProperty(value = "UTM MEDIUM 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmMedium}")
    private String utmMedium;

    /**
     * UTM CAMPAIGN 태그
     */
    @ApiModelProperty(value = "UTM CAMPAIGN 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmCampaign}")
    private String utmCampaign;

    /**
     * UTM TERM 태그
     */
    @ApiModelProperty(value = "UTM TERM 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmTerm}")
    private String utmTerm;

    /**
     * UTM CONTENT 태그
     */
    @ApiModelProperty(value = "UTM CONTENT 태그")
    @Size(max = 100, message = "{tps.abTest.error.size.utmContent}")
    private String utmContent;

    /**
     * AB테스트제목
     */
    @ApiModelProperty(value = "AB테스트제목")
    @NotNull(message = "{tps.abTest.error.notnull.abTestTitle}")
    @Size(max = 100, message = "{tps.abTest.error.size.abTestTitle}")
    private String abTestTitle;

    /**
     * AB테스트설명
     */
    @ApiModelProperty(value = "AB테스트설명")
    @Size(max = 1000, message = "{tps.abTest.error.size.abTestDesc}")
    private String abTestDesc;
}
