package jmnet.moka.core.tps.mvc.internalinterface.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpMethod;

/**
 * 내부 API 정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InternalInterfaceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<InternalInterfaceDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    @ApiModelProperty(value = "API 일련번호", hidden = true)
    @Min(value = 0, message = "{tps.internal-interface.error.min.seqNo}")
    private Long seqNo;

    /**
     * API명
     */
    @ApiModelProperty(value = "API명")
    @NotEmpty(message = "{tps.internal-interface.error.notempty.apiName}")
    @Size(max = 64, message = "{tps.internal-interface.error.size.apiName}")
    private String apiName;

    /**
     * 사용여부
     */
    @ApiModelProperty(value = "사용여부")
    @Pattern(regexp = "[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = MokaConstants.YES;

    /**
     * API유형(PC:PC,MO:MOBILE,PM:PC+MOBILE,BO:BACK OFFICE), 기타코드 그룹코드 : API_TYPE
     */
    @ApiModelProperty(value = "API 유형(PC:PC,MO:MOBILE,PM:PC+MOBILE,BO:BACK OFFICE)")
    @Pattern(regexp = "^((PC)|(MO)|(PM)|(BO))$", message = "{tps.internal-interface.error.pattern.apiType}")
    private String apiType;

    /**
     * API유형명
     */
    @ApiModelProperty(value = "API유형명", hidden = true)
    private String apiTypeName;

    /**
     * GET/POST/PUT/DELETE, 기타코드 그룹코드 : HTTP_METHOD
     */
    @ApiModelProperty(value = "GET/POST/PUT/DELETE")
    @NotEmpty(message = "{tps.internal-interface.error.notempty.apiMethod}")
    @Pattern(regexp = "^((GET)|(POST)|(PUT)|(DELETE))$", message = "{tps.internal-interface.error.pattern.apiMethod}")
    private String apiMethod = HttpMethod.GET.name();

    /**
     * API경로(HOST경로포함)
     */
    @ApiModelProperty(value = "API경로(HOST경로포함)")
    @NotEmpty(message = "{tps.internal-interface.error.notempty.apiPath}")
    @Size(max = 512, message = "{tps.internal-interface.error.size.apiPath}")
    private String apiPath;

    /**
     * API설명
     */
    @ApiModelProperty(value = "API설명")
    @Size(max = 4000, message = "{tps.internal-interface.error.size.apiDesc}")
    private String apiDesc;

    /**
     * 파라미터설명(NAME,DESC,REQUIRED,TYPE을결합하여JSON구조로 생성)
     */
    @ApiModelProperty(value = "파라미터설명(NAME,DESC,REQUIRED,TYPE을결합하여JSON구조로 생성)")
    @Size(max = 4000, message = "{tps.internal-interface.error.size.paramDesc}")
    private String paramDesc;

}
