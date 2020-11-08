package jmnet.moka.core.tps.mvc.dataset.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * 데이타셋 검색 DTO
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class DatasetSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    /**
     * 검색타입
     */
    private String searchType;

    /**
     * 검색어
     */
    private String keyword;

    /**
     * 총갯수 사용여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.useTotal}")
    private String useTotal;

    /**
     * 총갯수
     */
    private Long total;

    /**
     * 검색결과 성공여부
     */
    private Integer returnValue;

    /**
     * apiHost + apiPath 공통코드
     */
    private String apiCodeId;

    /**
     * 자동생성여부
     */
    private String autoCreateYn;

    /**
     * 데이터셋 목록 검색에 제외할 데이터셋ID 키값
     */
    private Long exclude;

    /**
     * 데이터API경로(기타코드)
     */
    @JsonIgnore
    private String apiPath;

    /**
     * 데이터API호스트(기타코드)
     */
    @JsonIgnore
    private String apiHost;

    public DatasetSearchDTO() {
        // 정렬 기본값을 설정
        super(DatasetVO.class, "datasetSeq,desc");
        autoCreateYn = TpsConstants.SEARCH_TYPE_ALL;
        useTotal = MokaConstants.YES;
        searchType = TpsConstants.SEARCH_TYPE_ALL;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
