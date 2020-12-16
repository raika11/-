/**
 * msp-tps ReservedSearchDTO.java 2020. 6. 17. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * 예약어 검색 DTO
 * 2020. 6. 17. ssc 최초생성
 * 
 * @since 2020. 6. 17. 오전 11:35:05
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@ApiModel("예약어 검색 DTO")
public class ReservedSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    // 검색 조건의 기본값을 설정
    public ReservedSearchDTO() {
        super("reservedSeq,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }
}
