package jmnet.moka.core.tps.mvc.abtest.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
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
 * Package : jmnet.moka.core.tps.mvc.abtest.dto
 * ClassName : AbTestCaseResultDTO
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
public class AbTestCaseResultDTO {
    public static final Type TYPE = new TypeReference<List<jmnet.moka.core.tps.mvc.board.dto.BoardInfoDTO>>() {
    }.getType();

    /**
     * 에피소드일련번호
     */
    @ApiModelProperty(value = "에피소드일련번호", hidden = true)
    private Integer abtestSeq;

    /**
     * A/B테스트 제목
     */
    @ApiModelProperty(value = "A/B테스트 제목")
    @NotNull(message = "{tps.abtest.error.notnull.abtestTitle}")
    @Size(max = 100, message = "{tps.abtest.error.size.abtestTitle}")
    private String abtestTitle;

    /**
     * A/B테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @ApiModelProperty("A/B테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)-필수")
    @Pattern(regexp = "[A|E|J|B|L]{1}$", message = "{tps.abtest.error.pattern.abtestType}")
    private String abtestType;

    private String abtestTypeNm;
    /**
     * 도메인 아이디
     */
    @ApiModelProperty("도메인 아이디-필수")
    @NotNull(message = "{tps.domain.error.pattern.domainId}")
    @Builder.Default
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId = "1000";

    private String domainIdNm;

    /**
     * AB테스트 페이지(메인:M, 섹션: S, 기사(본문외):A, 뉴스레터:L, 전체 또는 없음:'')
     */
    @ApiModelProperty("AB테스트 페이지(메인:M, 섹션: S, 기사(본문외):A, 뉴스레터:L, 전체 또는 없음:'')")
    private String pageType;

    /**
     * 페이지SEQ 또는 기사타입 (기타코드 SVC_AT), 선택없을때는 ''
     */
    @ApiModelProperty("페이지SEQ 또는 기사타입 (기타코드 SVC_AT), 선택없을때는 ''")
    private String pageValue;


    @ApiModelProperty("페이지SEQ 또는 기사타입 (기타코드 SVC_AT) 명")
    private String pageNm;

    /**
     * 영역구분(A:영역,C:컴포넌트,L:뉴스레터,P:파티클)
     */
    @ApiModelProperty("영역구분(A:영역,C:컴포넌트,L:뉴스레터,P:파티클)")
    private String zoneDiv;

    /**
     * 영역일련번호(AREA_SEQ,COMPONENT_SEQ,LETTER_SEQ,파티클구분(기타코드MC))
     */
    @ApiModelProperty("영역일련번호(AREA_SEQ,COMPONENT_SEQ,LETTER_SEQ,파티클구분(기타코드MC))")
    private String zoneSeq;

    @ApiModelProperty("영역일련번호명(AREA_SEQ,COMPONENT_SEQ,LETTER_SEQ,파티클구분(기타코드MC))")
    private String zoneNm;

    /**
     * AB테스트 대상(TPLT:디자인,레터레이아웃 / DATA:데이터 / COMP:컴포넌트(메인탑디자인 및 본문외) / 레터제목:LTIT / 발송일시 / LSDT / 발송자명:LSNM)
     */
    @ApiModelProperty("AB테스트 대상(TPLT:디자인,레터레이아웃 / DATA:데이터 / COMP:컴포넌트(메인탑디자인 및 본문외) / 레터제목:LTIT / 발송일시 / LSDT / 발송자명:LSNM)")
    @NotNull(message = "{tps.abtest.error.notnull.abtestPurpose}")
    private String abtestPurpose;

    private String abtestPurposeNm;

    /**
     * 시작일시 TB_ABTEST_CASE(A/B테스트 정의)
     * <p>
     * 테스트 시작일시 TB_ABTEST_INSTANCE(A/B테스트 인스턴스)
     */
    @ApiModelProperty("시작일시")
    @DTODateTimeFormat
    private Date startDt;

    /**
     * 종료일시 TB_ABTEST_CASE(A/B테스트 정의)
     * <p>
     * 테스트 종료일시 TB_ABTEST_INSTANCE(A/B테스트 인스턴스)
     */
    @ApiModelProperty("종료일시")
    @DTODateTimeFormat
    private Date endDt;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시")
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 생성자 TB_ABTEST_CASE(A/B테스트 정의)
     * <p>
     * 등록자(대안입력 편집자ID) TB_ABTEST_INSTANCE(A/B테스트 인스턴스)
     */
    @ApiModelProperty(value = "등록자")
    private String regId;

    /**
     * 등록자
     */
    @ApiModelProperty(value = "등록자")
    private String regNm;

    /**
     * 목표달성주기(JAM 수신기사의 경우 - 분단위)
     */
    @ApiModelProperty("목표달성주기(JAM 수신기사의 경우 - 분단위)")
    @NotNull(message = "{tps.abtest.error.min.endPeriod}")
    @Min(value = 0, message = "{tps.abtest.error.min.endPeriod}")
    private Long endPeriod = 0L;

    /**
     * 목표달성기준(P:기간 K:KPI A:모두)
     */
    @ApiModelProperty("목표달성기준(P:기간 K:KPI A:모두)")
    @Pattern(regexp = "[P|K|A]{1}$", message = "{tps.abtest.error.pattern.endCondi}")
    private String endCondi;

    /**
     * KPI달성 목표치(백분률(%)
     */
    @ApiModelProperty("KPI달성 목표치(백분률(%)")
    @Builder.Default
    @NotNull(message = "{tps.abtest.error.notnull.endKpi}")
    @Min(value = 0, message = "{tps.abtest.error.min.endKpi}")
    private Long endKpi = 0L;

    /**
     * KPI산정조건(클릭수)
     */
    @ApiModelProperty("KPI산정조건(클릭수)")
    @Builder.Default
    @NotNull(message = "{tps.abtest.error.notnull.kpiClickCondi}")
    @Min(value = 0, message = "{tps.abtest.error.min.kpiClickCondi}")
    private Long kpiClickCondi = 0L;

    /**
     * KPI산정조건(분)
     */
    @ApiModelProperty("KPI산정조건(분)")
    @Builder.Default
    @NotNull(message = "{tps.abtest.error.notnull.kpiPeriodCondi}")
    @Min(value = 0, message = "{tps.abtest.error.min.kpiPeriodCondi}")
    private Long kpiPeriodCondi = 0L;

    /**
     * A/B테스트 그룹생성 방식(R:랜덤, S:고정) / TB_ABTEST_GRP(A/B테스트 그룹) ABTEST_GRP_METHOD
     */
    @ApiModelProperty("A/B테스트 그룹생성 방식(R:랜덤, S:고정)")
    @Pattern(regexp = "[R|S]{1}$", message = "{tps.abtest.error.pattern.abtestGrpMethod}")
    private String abtestGrpMethod;

    /**
     * AB테스트 그룹(랜덤:비율 / 고정:0~9숫자)
     */
    @ApiModelProperty("AB테스트 그룹(랜덤:비율 / 고정:0~9숫자)")
    private String abtestGrpA;

    @ApiModelProperty("AB테스트 그룹(랜덤:비율 / 고정:0~9숫자)")
    private String abtestGrpB;

    /**
     * KPI달성율(A) / TB_ABTEST_INSTANCE(A/B테스트 인스턴스) KPI_VALUE_A
     */
    @ApiModelProperty("KPI달성율(A) ")
    @Builder.Default
    private Long kpiValueA = 0L;

    /**
     * KPI달성율(B) / TB_ABTEST_INSTANCE(A/B테스트 인스턴스) KPI_VALUE_B
     */
    @ApiModelProperty("KPI달성율(B)")
    @Builder.Default
    private Long kpiValueB = 0L;

    /**
     * 서비스기사ID(JAM설계경우) / TB_ABTEST_INSTANCE(A/B테스트 인스턴스) TOTAL_ID
     */
    @ApiModelProperty("서비스기사ID(JAM설계경우)")
    private Long totalId;
    /**
     * 화면편집파트(T:제목,L:리드문,I:이미지,R;관련기사) / TB_ABTEST_INSTANCE(A/B테스트 인스턴스) DESKING_PART
     */
    @ApiModelProperty("화면편집파트(T:제목,L:리드문,I:이미지,R;관련기사) : 텍스트 Comma(,)로 여러 개 입력")
    @Size(max = 10, message = "{tps.abtest.error.size.deskingPart}")
    private String deskingPart;

    /**
     * VARIANT일련번호(템플릿SEQ/데이터셋SEQ/컴포넌트SEQ/컨테이너SEQ) / TB_ABTEST_VARIANT(AB테스트 VARIANT) VARIANT_SEQ
     */
    @ApiModelProperty("VARIANT일련번호(템플릿SEQ/데이터셋SEQ/컴포넌트SEQ/컨테이너SEQ)")
    @Builder.Default
    private Long variantSeqA = 0L;

    @ApiModelProperty("VARIANT일련번호(템플릿SEQ/데이터셋SEQ/컴포넌트SEQ/컨테이너SEQ)")
    @Builder.Default
    private Long variantSeqB = 0L;

    /**
     * 제목(JAM,뉴스레터), 뉴스레터 발송시간, 뉴스레터 발송자명   / TB_ABTEST_VARIANT(AB테스트 VARIANT) VARIANT_VALUE
     */
    @ApiModelProperty(value = "A테스트 제목(JAM,뉴스레터), 뉴스레터 발송시간, 뉴스레터 발송자명")
    private String variantValueA;

    @ApiModelProperty(value = "B테스트 제목(JAM,뉴스레터), 뉴스레터 발송시간, 뉴스레터 발송자명")
    private String variantValueB;

    /**
     * 기사내용
     */
    @ApiModelProperty(value = "A테스트 기사내용")
    private String artContentA;

    @ApiModelProperty(value = "B테스트 기사내용")
    private String artContentB;
}
