/**
 * msp-tps DirectLinkSearchDTO.java 2020. 11. 16. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
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
@Alias("DirectLinkSearchDTO")
@ApiModel("바로가기 검색 DTO")
public class DirectLinkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    private String usedYn;

    /**
     * 노출고정(y:항상노출n:검색시만노출)
     */
    @ApiModelProperty("노출고정(y:항상노출n:검색시만노출)")
    private String fixYn;

    /**
     * 링크타입(s:본창n:새창)
     */
    @ApiModelProperty("링크타입(s:본창n:새창)")
    private String linkType;

    /**
     * 링크 키워드
     */
    @ApiModelProperty("링크 키워드")
    private String linkKwd;


    /**
     * 검색결과 성공여부
     */
    @ApiModelProperty(hidden = true)
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public DirectLinkSearchDTO() {
        super("linkSeq,desc");
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}
