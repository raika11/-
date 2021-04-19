package jmnet.moka.core.tps.mvc.abTest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.abTest.vo.ABTestCaseVO;
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
public class ABTestCaseSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 매체코드(도메인 정보)
     */
    @ApiModelProperty("도메인ID")
    private String domainId;

    /**
     * 상태(임시T/진행Y/대기P/종료Q)
     */
    @ApiModelProperty("상태(임시T/진행Y/대기P/종료Q)")
    private String status;

    /**
     * 페이지SEQ
     */
    @ApiModelProperty("페이지일련번호")
    private Long pageSeq = 0l;

    /**
     * 영역일련번호(대안입력-디자인의 경우 영역으로 선택)
     */
    @ApiModelProperty("영역일련번호")
    private Long areaSeq = 0l;

    /**
     * AB테스트 목표(T:디자인 D:데이터)
     */
    @ApiModelProperty("테스트대상(T:디자인 D:데이터)")
    private String abTestPurpose;

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
     * AB테스트 유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)
     */
    @ApiModelProperty("유형(A:직접설계 / E:대안입력 / J:JAM / B:광고 / L:뉴스레터)")
    private String abTestType;

    /**
     * 제목
     */
    @ApiModelProperty("제목")
    private String abTestTitle;

    /**
     * 설명
     */
    @ApiModelProperty("설명")
    private String abTestDesc;

    public ABTestCaseSearchDTO() {
        super(ABTestCaseVO.class, "abTestSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
