package jmnet.moka.core.tps.mvc.dataset.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.dataset.vo.DatasetVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class DatasetSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    private String searchType;

    private String keyword;

    private String apiCodeId;	// apiHost + apiPath 공통코드

    private String autoCreateYn;
    
    // 데이터셋 목록 검색에 제외할 데이터셋ID 키값
    private List<Long> exclude;

    @JsonIgnore
    private String apiHost;

    @JsonIgnore
    private String apiPath;

    // 정렬 기본값을 설정
    public DatasetSearchDTO() {
        super(DatasetVO.class, "datasetSeq,desc");
        autoCreateYn = "all";
    }
}
