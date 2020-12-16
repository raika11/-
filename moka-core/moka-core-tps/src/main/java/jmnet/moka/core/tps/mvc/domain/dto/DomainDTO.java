package jmnet.moka.core.tps.mvc.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.DomainItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 도메인 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 1:32:16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("도메인 DTO")
public class DomainDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722632117L;

    public static final Type TYPE = new TypeReference<List<DomainDTO>>() {
    }.getType();

    @ApiModelProperty("도메인 아이디(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    @ApiModelProperty("도메인명(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainName}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.notnull.domainName}")
    @Length(min = 1, max = 64, message = "{tps.domain.error.length.domainName}")
    private String domainName;

    @ApiModelProperty("도메인url(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainUrl}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.notnull.domainUrl}")
    @Length(min = 1, max = 512, message = "{tps.domain.error.length.domainUrl}")
    private String domainUrl;

    @ApiModelProperty("서비스 플랫폼 P : PC, M : 모바일(필수)")
    @NotNull(message = "{tps.domain.error.notnull.servicePlatform}")
    @Pattern(regexp = "[P|M]{1}$", message = "{tps.domain.error.notnull.servicePlatform}")
    private String servicePlatform;

    @ApiModelProperty("사용여부 Y : 예, N : 아니오(필수)")
    @NotNull(message = "{tps.domain.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.domain.error.notnull.usedYn}")
    private String usedYn;

    @ApiModelProperty("언어")
    @Length(min = 0, max = 3, message = "{tps.domain.error.length.lang}")
    private String lang;

    @ApiModelProperty("api host")
    private String apiHost;

    @ApiModelProperty("api path")
    private String apiPath;

    @ApiModelProperty("api code id : apiHost + apiPath")
    private String apiCodeId;        // apiHost + apiPath

    @ApiModelProperty("도메인 상세 설명")
    private String description;

    public DomainItem toDomainItem() {
        DomainItem domainItem = new DomainItem();
        domainItem.put(ItemConstants.DOMAIN_ID, this.domainId);
        domainItem.put(ItemConstants.DOMAIN_NAME, this.domainName);
        domainItem.put(ItemConstants.DOMAIN_URL, this.domainUrl);
        domainItem.put(ItemConstants.DOMAIN_SERVICE_PLATFORM, this.servicePlatform);
        domainItem.put(ItemConstants.DOMAIN_USE_YN, this.usedYn);
        domainItem.put(ItemConstants.DOMAIN_LANG, this.lang);
        domainItem.put(ItemConstants.DOMAIN_API_HOST, this.apiHost);
        domainItem.put(ItemConstants.DOMAIN_API_PATH, this.apiPath);
        domainItem.put(ItemConstants.DOMAIN_DESCRIPTION, this.description);
        return domainItem;
    }
}
