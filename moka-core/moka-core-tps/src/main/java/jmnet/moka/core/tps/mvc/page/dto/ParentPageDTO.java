package jmnet.moka.core.tps.mvc.page.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 부모페이지 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@ApiModel("부모 페이지 DTO")
public class ParentPageDTO implements Serializable {

    private static final long serialVersionUID = 4232007330201723143L;

    public static final Type TYPE = new TypeReference<List<ParentPageDTO>>() {
    }.getType();

    @ApiModelProperty("페이지SEQ")
    @Min(value = 0, message = "{tps.page.error.min.pageSeq}")
    private Long pageSeq;

    @ApiModelProperty("페이지명")
    @NotNull(message = "{tps.page.error.notnull.pageName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageName}")
    @Length(min = 1, max = 256, message = "{tps.page.error.length.pageName}")
    private String pageName;

    @ApiModelProperty("페이지URL")
    @NotNull(message = "{tps.page.error.notnull.pageUrl}")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.pageUrl}")
    @Length(min = 1, max = 512, message = "{tps.page.error.length.pageUrl}")
    private String pageUrl;

}
