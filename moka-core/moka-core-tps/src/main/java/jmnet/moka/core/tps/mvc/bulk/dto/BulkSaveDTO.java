package jmnet.moka.core.tps.mvc.bulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
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

    @NotNull(message = "{tps.bulk.error.notnull.bulkartDiv}")
    private String bulkartDiv;

    @NotNull(message = "{tps.bulk.error.notnull.sourceCode}")
    private String sourceCode;

    @NotNull(message = "{tps.bulk.error.notnull.status}")
    private String status;

    private String usedYn;
}
