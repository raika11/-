/**
 * msp-tps ReservedSearchDTO.java 2020. 6. 17. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 기자관리 검색 DTO 2020. 11. 11. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 11. 오전 11:35:05
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ReporterSearchDTO")
@ApiModel("기자 검색 DTO")
public class ReporterSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * 검색결과 성공여부
     */
    @ApiModelProperty(hidden = true)
    private Integer returnValue;

    @ApiModelProperty("페이징여부")
    private String usePaging;

    @ApiModelProperty("사용여부")
    private String usedYn;

    // 검색 조건의 기본값을 설정
    public ReporterSearchDTO() {
        super("repSeq,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
        usePaging = MokaConstants.YES;
        usedYn = TpsConstants.SEARCH_TYPE_ALL;
    }
}
