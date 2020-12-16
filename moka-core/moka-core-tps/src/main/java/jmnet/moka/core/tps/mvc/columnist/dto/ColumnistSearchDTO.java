/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.dto;

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
 * 기자관리 검색 DTO 2020. 11. 16. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 16. 오전 11:35:05
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ColumnistSearchDTO")
@ApiModel("칼럼니스트 검색 DTO")
public class ColumnistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * char	1   ('N')	NO	상태(유효/정지)
     */
    @ApiModelProperty("상태(유효/정지)")
    private String status;

    /**
     * 검색결과 성공여부
     */
    @ApiModelProperty(hidden = true)
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public ColumnistSearchDTO() {
        super("seqNo,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
