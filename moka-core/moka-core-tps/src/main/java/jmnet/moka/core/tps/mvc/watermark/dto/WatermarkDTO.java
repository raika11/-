package jmnet.moka.core.tps.mvc.watermark.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.watermark.dto
 * ClassName : WatermarkDTO
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 13:27
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("워터마크 이미지 DTO")
public class WatermarkDTO {

    public static final Type TYPE = new TypeReference<List<WatermarkDTO>>() {
    }.getType();

    @JsonProperty("name")
    private String title;

    @JsonProperty("height")
    private String imgHeight;

    @JsonProperty("width")
    private String imgWidth;

    @JsonProperty("path")
    private String imgUrl;
}
