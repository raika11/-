/**
 * msp-tps DatasetInfoDTO.java 2020. 4. 24. 오후 4:26:55 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.DatasetItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 데이타셋 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("데이타셋 DTO")
public class DatasetDTO implements Serializable {

    private static final long serialVersionUID = -8944721450946210579L;

    public static final Type TYPE = new TypeReference<List<DatasetDTO>>() {
    }.getType();

    @ApiModelProperty("데이터셋SEQ")
    @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}")
    private Long datasetSeq;

    @ApiModelProperty("데이터셋명(필수)")
    @NotNull(message = "{tps.dataset.error.notnull.datasetName}")
    @Pattern(regexp = ".+", message = "{tps.dataset.error.pattern.datasetName}")
    @Length(min = 1, max = 128, message = "{tps.dataset.error.length.datasetName}")
    private String datasetName;

    @ApiModelProperty("API코드(기타코드) : apiHost + apiPath(필수)")
    @NotNull(message = "{tps.dataset.error.notnull.apiCodeId}")
    @Length(min = 1, max = 24, message = "{tps.dataset.error.length.apiCodeId}")
    private String apiCodeId;    // apiHost + apiPath 공통코드

    @ApiModelProperty("데이터API경로")
    @Length(max = 256, message = "{tps.dataset.error.length.dataApiPath}")
    private String dataApiPath;

    @ApiModelProperty("데이터API호스트")
    @Length(max = 256, message = "{tps.dataset.error.length.dataApiHost}")
    private String dataApiHost;

    @ApiModelProperty("데이터API")
    @Length(max = 256, message = "{tps.dataset.error.length.dataApi}")
    private String dataApi;

    @ApiModelProperty("데이터API파라미터")
    @Length(max = 2040, message = "{tps.dataset.error.length.dataApiParam}")
    private String dataApiParam;

    @ApiModelProperty("상세정보")
    @Length(max = 4000, message = "{tps.dataset.error.length.description}")
    private String description;

    @ApiModelProperty("자동생성여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.dataset.error.pattern.autoCreateYn}")
    @Builder.Default
    private String autoCreateYn = MokaConstants.NO;

    @ApiModelProperty("디비상에는 없는 파라미터의 형식정보.(dps의 parameter정보)")
    private String dataApiParamShape;

    public DatasetItem toDatasetItem() {
        DatasetItem datasetItem = new DatasetItem();
        datasetItem.put(ItemConstants.DATASET_ID, this.datasetSeq);
        datasetItem.put(ItemConstants.DATASET_NAME, this.datasetName);
        datasetItem.put(ItemConstants.DATASET_API_PATH, this.dataApiPath);
        datasetItem.put(ItemConstants.DATASET_API_HOST, this.dataApiHost);
        datasetItem.put(ItemConstants.DATASET_API, this.dataApi);
        datasetItem.put(ItemConstants.DATASET_API_PARAM, this.dataApiParam);
        datasetItem.put(ItemConstants.DATASET_AUTO_CREATE_YN, this.autoCreateYn);
        return datasetItem;
    }
}
