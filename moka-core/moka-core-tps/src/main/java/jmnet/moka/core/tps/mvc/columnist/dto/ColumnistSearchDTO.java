/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import javax.validation.constraints.Pattern;
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
     * 일련번호
     */
    private Long seqNo;

    /**
     * char	1   ('N')	NO	상태(유효/정지)
     */
    private String status;


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

    // 검색 조건의 기본값을 설정
    public ColumnistSearchDTO() {
        super("seqNo,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
