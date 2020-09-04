package jmnet.moka.core.tps.mvc.etccode.dto;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class EtccodeSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -8371179050668989365L;

    @NotNull(message = "{tps.etccodeType.error.invalid.codeTypeId}")
    private String codeTypeId;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public EtccodeSearchDTO() {
        super("codeOrder,asc");
    }
}
