package jmnet.moka.core.tps.mvc.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 도메인ID, 매체ID, 도메인명, 볼륨ID
 * 2020. 2. 6. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 2. 6. 오후 5:46:30
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("간단 도메인 DTO")
public class DomainSimpleDTO implements Serializable {

    private static final long serialVersionUID = -7979684085879328911L;

    public static final Type TYPE = new TypeReference<List<DomainSimpleDTO>>() {
    }.getType();

    @ApiModelProperty("도메인 아이디")
    private String domainId;

    @ApiModelProperty("도메인명")
    private String domainName;

    @ApiModelProperty("도메인 URL")
    private String domainUrl;

    @ApiModelProperty("서비스 플랫폼 P : PC, M : 모바일")
    private String servicePlatform;
}
