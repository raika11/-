package jmnet.moka.core.tps.mvc.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
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
public class DomainDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722632117L;

    public static final Type TYPE = new TypeReference<List<DomainDTO>>() {
    }.getType();

    /**
     * 도메인 아이디
     */
    @NotNull(message = "{tps.domain.error.pattern.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    /**
     * 도메인 명
     */
    @NotNull(message = "{tps.domain.error.notnull.domainName}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.notnull.domainName}")
    @Length(min = 1, max = 64, message = "{tps.domain.error.length.domainName}")
    private String domainName;

    /**
     * 도메인 url
     */
    @NotNull(message = "{tps.domain.error.notnull.domainUrl}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.notnull.domainUrl}")
    @Length(min = 1, max = 512, message = "{tps.domain.error.length.domainUrl}")
    private String domainUrl;

    /**
     * 서비스 플랫폼 P : PC, M : 모바일
     */
    @NotNull(message = "{tps.domain.error.notnull.servicePlatform}")
    @Pattern(regexp = "[P|M]{1}$", message = "{tps.domain.error.notnull.servicePlatform}")
    private String servicePlatform;

    /**
     * 사용여부 Y : 예, N : 아니오
     */
    @NotNull(message = "{tps.domain.error.notnull.useYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.domain.error.notnull.useYn}")
    private String useYn;

    /**
     * 언어
     */
    @Length(min = 0, max = 3, message = "{tps.domain.error.length.lang}")
    private String lang;

    /**
     * api host
     */
    private String apiHost;

    /**
     * api path
     */
    private String apiPath;

    /**
     * api code id
     */
    private String apiCodeId;        // apiHost + apiPath

    /**
     * 도메인 상세 설명
     */
    private String description;

    public DomainItem toDomainItem() {
        DomainItem domainItem = new DomainItem();
        domainItem.put(ItemConstants.DOMAIN_ID, this.domainId);
        domainItem.put(ItemConstants.DOMAIN_NAME, this.domainName);
        domainItem.put(ItemConstants.DOMAIN_URL, this.domainUrl);
        domainItem.put(ItemConstants.DOMAIN_SERVICE_PLATFORM, this.servicePlatform);
        domainItem.put(ItemConstants.DOMAIN_USE_YN, this.useYn);
        domainItem.put(ItemConstants.DOMAIN_LANG, this.lang);
        domainItem.put(ItemConstants.DOMAIN_API_HOST, this.apiHost);
        domainItem.put(ItemConstants.DOMAIN_API_PATH, this.apiPath);
        domainItem.put(ItemConstants.DOMAIN_DESCRIPTION, this.description);
        return domainItem;
    }
}
