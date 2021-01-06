package jmnet.moka.core.tps.mvc.bright.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.dto
 * ClassName : OvpSaveDTO
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel(description = "브라이트 코브 비디오 생성 DTO")
public class OvpSaveDTO implements Serializable {

    @ApiModelProperty("명칭")
    @JsonProperty("name")
    private String name;

    @ApiModelProperty("설명 250자")
    @JsonProperty("description")
    private String description;

    @ApiModelProperty("설명 5000자")
    @JsonProperty("long_description")
    private String longDescription;

    @ApiModelProperty("명칭")
    @JsonProperty("reference_id")
    private String referenceId;

    @ApiModelProperty("명칭")
    @JsonProperty("name")
    @Builder.Default
    private String state = "ACTIVE";

    @ApiModelProperty("tags")
    @JsonProperty("tags")
    @Builder.Default
    private String[] tags = new String[0];

    @ApiModelProperty("custom_fields")
    @JsonProperty("custom_fields")
    @Builder.Default
    private Map<String, String> customFields = new HashMap<>();

    @ApiModelProperty("schedule")
    @JsonProperty("schedule")
    @Builder.Default
    private Map<String, String> schedule = new HashMap<>();
}
