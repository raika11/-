package jmnet.moka.core.tps.mvc.watermark.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

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
public class WatermarkDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<WatermarkDTO>>() {
    }.getType();

    /**
     * 링크일련번호
     */
    @ApiModelProperty(value = "일련번호", hidden = true)
    @Min(value = 0, message = "{tps.watermark.error.pattern.seqNo}")
    //@Size(min = 1, max = 4, message = "{tps.watermark.error.pattern.seqNo}")
    private Long seqNo;

    /**
     * 출처
     */
    @ApiModelProperty("출처")
    @NotNull(message = "{tps.watermark.error.notnull.sourceCode}")
    @Length(min = 1, max = 2, message = "{tps.watermark.error.length.sourceCode}")
    @JsonProperty("출처")
    private String sourceCode;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    @ApiModelProperty("사용여부(Y:사용,N:미사용)")
    @NotNull(message = "{tps.watermark.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.watermark.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 제목
     */
    @ApiModelProperty("제목")
    @NotNull(message = "{tps.watermark.error.notnull.title}")
    @Length(min = 1, max = 100, message = "{tps.watermark.error.length.title}")
    @JsonProperty("name")
    private String title;

    /**
     * 이미지세로
     */
    @ApiModelProperty("이미지세로")
    @NotNull(message = "{tps.watermark.error.notnull.imgHeight}")
    @Length(min = 1, max = 10, message = "{tps.watermark.error.length.imgHeight}")
    @JsonProperty("height")
    private String imgHeight;

    /**
     * 이미지가로
     */
    @ApiModelProperty("이미지가로")
    @NotNull(message = "{tps.watermark.error.notnull.imgWidth}")
    @Length(min = 1, max = 10, message = "{tps.watermark.error.length.imgWidth}")
    @JsonProperty("width")
    private String imgWidth;

    /**
     * 이미지URL
     */
    @ApiModelProperty("이미지url")
    @NotNull(message = "{tps.watermark.error.notnull.imgUrl}")
    @Length(min = 1, max = 200, message = "{tps.watermark.error.length.imgUrl}")
    @JsonProperty("path")
    private String imgUrl;

    /**
     * 노출고정(y:항상노출n:검색시만노출)
    @ApiModelProperty("노출고정(y:항상노출, n:검색시만노출)")
    @NotNull(message = "{tps.watermark.error.notnull.fixYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.watermark.notnull.fixYn}")
    @Builder.Default
    private String fixYn = MokaConstants.YES;
     */

    /**
     * 등록일자
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 등록자아이디
     */
    @ApiModelProperty(hidden = true)
    private String regId;

    /**
     * 수정일자
     */
    @ApiModelProperty(hidden = true)
    @DTODateTimeFormat
    private Date modDt;

    /**
     * 수정자아이디
     */
    @ApiModelProperty(hidden = true)
    private String modId;

}
