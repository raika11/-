package jmnet.moka.core.tps.mvc.abtest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;


/**
 * ABTest 전체 목록 조회 DTO
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ABTestCaseSearchDTO")
@ApiModel("ABTest 목록 검색 DTO")
public class AbTestCaseSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * A/B테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @ApiModelProperty("유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)")
    private String abtestType;

    /**
     * 매체코드(도메인 정보)
     */
    @ApiModelProperty("도메인ID")
    private String domainId;

    /**
     * AB테스트 페이지(메인:M, 기사:A, 뉴스레터:L)
     */
    @ApiModelProperty("AB테스트 페이지(메인:M, 기사:A, 뉴스레터:L)")
    private String pageType;

    /**
     * 페이지SEQ
     */
    @ApiModelProperty("페이지일련번호")
    private Long pageSeq = 0l;

    /**
     * 기사타입(직접-기사-본문외) - 기본형:B, 연재형:CWYZ, QA형:X, 특집형:S, 이슈라이브:TG
     */
    @ApiModelProperty("기사타입(직접-기사-본문외) - 기본형:B, 연재형:CWYZ, QA형:X, 특집형:S, 이슈라이브:TG")
    private String artType;

    /**
     * 영역구분(A:영역,C:컴포넌트,L:뉴스레터,P:파티클)
     */
    @ApiModelProperty("영역구분(A:영역,C:컴포넌트,L:뉴스레터,P:파티클)")
    private String zoneDiv;

    /**
     * 영역일련번호(AREA_SEQ,COMPONENT_SEQ,LETTER_SEQ,파티클구분(기타코드MC))
     */
    @ApiModelProperty("영역일련번호(AREA_SEQ,COMPONENT_SEQ,LETTER_SEQ,파티클구분(기타코드MC))")
    private Long zoneSeq = 0l;

    /**
     * A/B테스트 목표(T:디자인 D:데이터)
     */
    @ApiModelProperty("테스트대상(T:디자인 D:데이터)")
    private String abtestPurpose;

    /**
     * 시작일시
     */
    @ApiModelProperty(value = "시작일시")
    @DTODateTimeFormat
    private String startDt;

    /**
     * 종료일시
     */
    @ApiModelProperty(value = "종료일시")
    @DTODateTimeFormat
    private String endDt;

    /**
     * 제목
     */
    @ApiModelProperty("제목")
    private String abtestTitle;

    /**
     * 설명
     */
    @ApiModelProperty("설명")
    private String abtestDesc;

    /**
     * 작성자
     */
    @ApiModelProperty("작성자")
    private String regId;

    /**
     * 작성자명
     */
    @ApiModelProperty("작성자명")
    private String regNm;

    /**
     * 상태(임시T/진행Y/대기P/종료Q)
     */
    @ApiModelProperty("상태(임시T/진행Y/대기P/종료Q)")
    private String status;

    public AbTestCaseSearchDTO() {
        super(AbTestCaseVO.class, "abtestSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
