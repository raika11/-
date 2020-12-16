package jmnet.moka.core.tps.mvc.dataset.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
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
@EqualsAndHashCode(callSuper = true)
@ApiModel("데이타셋 검색 DTO")
public class DatasetSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    @ApiModelProperty("apiHost + apiPath 공통코드")
    private String apiCodeId;

    @ApiModelProperty("자동생성여부")
    private String autoCreateYn;

    @ApiModelProperty("데이터셋 목록 검색에 제외할 데이터셋ID 키값")
    private Long exclude;

    @ApiModelProperty("데이터API경로")
    @JsonIgnore
    private String apiPath;

    @ApiModelProperty("데이터API호스트")
    @JsonIgnore
    private String apiHost;

    public DatasetSearchDTO() {
        // 정렬 기본값을 설정
        super(DatasetVO.class, "datasetSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
        this.autoCreateYn = TpsConstants.SEARCH_TYPE_ALL;
    }
}
