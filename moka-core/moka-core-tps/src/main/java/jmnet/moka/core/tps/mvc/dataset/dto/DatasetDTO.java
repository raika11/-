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

import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 데이타셋 DTO
 * 2020. 4. 24. ssc 최초생성
 * 
 * @since 2020. 4. 24. 오후 4:26:55
 * @author ssc
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DatasetDTO implements Serializable {

    private static final long serialVersionUID = -8944721450946210579L;

    public static final Type TYPE = new TypeReference<List<DatasetDTO>>() {}.getType();

    /**
     * 데이터셋SEQ
     */
    @Min(value = 0, message = "{tps.dataset.error.min.datasetSeq}")
    private Long datasetSeq;

    /**
     * 데이터셋명
     */
    @NotNull(message = "{tps.dataset.error.notnull.datasetName}")
    @Pattern(regexp = ".+", message = "{tps.dataset.error.pattern.datasetName}")
    @Length(min = 1, max = 128, message = "{tps.dataset.error.length.datasetName}")
    private String datasetName;

    /**
     * API코드(기타코드) : apiHost + apiPath
     */
    @NotNull(message = "{tps.dataset.error.notnull.apiCodeId}")
    @Length(min=1, max = 24, message = "{tps.dataset.error.length.apiCodeId}")
    private String apiCodeId;	// apiHost + apiPath 공통코드

    /**
     * 데이터API경로(기타코드)
     */
    @Length(max = 256, message = "{tps.dataset.error.length.dataApiPath}")
    private String dataApiPath;

    /**
     * 데이터API호스트(기타코드)
     */
    @Length(max = 256, message = "{tps.dataset.error.length.dataApiHost}")
    private String dataApiHost;

    /**
     * 데이터API
     */
    @Length(max = 256, message = "{tps.dataset.error.length.dataApi}")
    private String dataApi;

    /**
     * 데이터API파라미터
     */
    @Length(max = 2040, message = "{tps.dataset.error.length.dataApiParam}")
    private String dataApiParam;

    /**
     * 상세정보
     */
    @Length(max = 4000, message = "{tps.dataset.error.length.description}")
    private String description;

    /**
     * 자동생성여부
     */
    @NotNull(message = "{tps.dataset.error.invalid.autoCreateYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.dataset.error.invalid.autoCreateYn}")
    @Builder.Default
    private String autoCreateYn = MokaConstants.NO;

    /**
     * 디비상에는 없는 파라미터의 형식정보.(dps의 parameter정보)
     */
    private String dataApiParamShape;
}
