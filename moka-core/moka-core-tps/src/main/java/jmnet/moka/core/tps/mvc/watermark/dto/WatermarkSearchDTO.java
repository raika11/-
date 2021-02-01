/**
 * msp-tps WaterNarkSearchDTO.java 2020. 10. 22. 오전 11:35:05 ssc
 */
package jmnet.moka.core.tps.mvc.watermark.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.*;
import org.apache.ibatis.type.Alias;

/**
 * 워터마크 검색 DTO 2021. 01. 21. ssc 최초생성
 *
 * @author ssc
 * @since 2021. 01. 21. 오전 11:35:05
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("WatermarkSearchDTO")
@ApiModel("워터마크 검색 DTO")
public class WatermarkSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1972229889422176779L;

    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    private String usedYn;

    /**
     * 검색결과 성공여부
     */
    @ApiModelProperty(hidden = true)
    private Integer returnValue;

    // 검색 조건의 기본값을 설정
    public WatermarkSearchDTO() {
        super("seqNo,desc");
        returnValue = TpsConstants.PROCEDURE_SUCCESS;
    }
}