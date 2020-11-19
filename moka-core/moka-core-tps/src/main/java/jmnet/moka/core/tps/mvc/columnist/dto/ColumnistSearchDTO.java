/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.*;
import org.apache.ibatis.type.Alias;

import javax.validation.constraints.Pattern;

/**
 * 기자관리 검색 DTO
 * 2020. 11. 16. ssc 최초생성
 * 
 * @since 2020. 11. 16. 오전 11:35:05
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ColumnistSearchDTO")
public class ColumnistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * 일련번호
     */
    private Long seqNo;

    /**
     * char	1   ('O')   NO	내외부구분(I내부,O외부)
     */
    private String inout;

    /**
     * char	1   ('N')	NO	상태(유효/정지)
     */
    private String status;

    /**
     * char	1   ('N')	NO	상태(유효/정지)
     */
    private String columnNm;

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
        super("reqNo,desc");
        useTotal = MokaConstants.YES;
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
