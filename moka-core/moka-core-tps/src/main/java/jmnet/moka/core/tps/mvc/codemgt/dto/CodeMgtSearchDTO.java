package jmnet.moka.core.tps.mvc.codemgt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@ApiModel("상세코드 검색 DTO")
public class CodeMgtSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -8371179050668989365L;

    @ApiModelProperty("그룹코드(필수)")
    @NotNull(message = "{tps.codeMgt.error.invalid.grpCd}")
    private String grpCd;

    // 검색 조건의 기본값을 설정
    public CodeMgtSearchDTO() {
        super("cdOrd,asc");
        searchType = TpsConstants.SEARCH_TYPE_ALL;
    }
}
