/**
 * msp-tps DatasetInfoDTO.java 2020. 4. 24. 오후 4:26:55 ssc
 */
package jmnet.moka.core.tps.mvc.dataset.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 
 * 2020. 4. 24. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 24. 오후 4:26:55
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetDTO implements Serializable {

    private static final long serialVersionUID = -8944721450946210579L;

    public static final Type TYPE = new TypeReference<List<DatasetDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.dataset.error.invalid.datasetSeq}")
    private Long datasetSeq;

    @NotNull(message = "{tps.dataset.error.invalid.datasetName}")
    @Pattern(regexp = ".+", message = "{tps.dataset.error.invalid.datasetName}")
    private String datasetName;

    @NotNull(message = "{tps.dataset.error.invalid.apiCodeId}")
    @Pattern(regexp = ".+", message = "{tps.dataset.error.invalid.apiCodeId}")
    private String apiCodeId;	// apiHost + apiPath 공통코드

    private String dataApiHost;

    private String dataApiPath;

    private String dataApi;

    private String dataApiParam;

    private String autoCreateYn;

    private String description;

    private String dataApiParamShape;   // 디비상에는 없는 파라미터의 형식정보.(dps의 parameter정보)

}
