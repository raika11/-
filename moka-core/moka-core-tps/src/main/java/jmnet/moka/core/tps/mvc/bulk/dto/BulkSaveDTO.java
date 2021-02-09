package jmnet.moka.core.tps.mvc.bulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 벌크문구 저장용 DTO
 * 2020. 11. 16. obiwan 최초생성
 * </pre>
 *
 * @author obiwan
 * @since 2020. 11. 16. 오후 1:32:16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("벌크 저장 DTO")
public class BulkSaveDTO implements Serializable {

    @ApiModelProperty("구분코드")
    @NotNull(message = "{tps.bulk.error.notnull.bulkartDiv}")
    private String bulkartDiv;

    @ApiModelProperty("소스코드")
    @NotNull(message = "{tps.bulk.error.notnull.sourceCode}")
    private String sourceCode;

    @ApiModelProperty("상태")
    @NotNull(message = "{tps.bulk.error.notnull.status}")
    private String status;

    @ApiModelProperty("사용여부")
    private String usedYn;

    //종합문구(저장 후 자동입력)
    @ApiModelProperty(hidden = true)
    private String content;

    //JHOT Revised 변경요청 procedure 반환값
    @ApiModelProperty(hidden = true)
    private Integer returnValue;
}
