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
 * ABTest 결과 목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abtest.vo
 * ClassName : AbTestCaseResultVO
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 09:54
 */

@Alias("AbTestCaseResultVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AbTestCaseResultVO {

    /**
     * A/B테스트일련번호
     */
    @Column(name = "ABTEST_SEQ")
    private Long abtestSeq = 0l;

    /**
     * A/B테스트 제목
     */
    @Column(name = "ABTEST_TITLE")
    private String abtestTitle;

    /**
     * A/B테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @Column(name = "ABTEST_TYPE")
    private String abtestType;

    /**
     * 도메인ID
     */
    @Column(name = "DOMAIN_ID")
    private String domainId;
    /**
     * 도메인ID명
     */
    private String domainIdNm;

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
     * 작성일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 생성자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 생성자명
     */
    @Column(name = "REG_NM")
    private String regNm;

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
}
