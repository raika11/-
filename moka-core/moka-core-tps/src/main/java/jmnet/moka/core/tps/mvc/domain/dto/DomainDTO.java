package jmnet.moka.core.tps.mvc.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.DomainItem;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <pre>
 * 도메인 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 1:32:16
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DomainDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722632117L;

    public static final Type TYPE = new TypeReference<List<DomainDTO>>() {}.getType();

    /**
     * 도메인 아이디
     */
    @NotNull(message = "{tps.domain.error.invalid.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.invalid.domainId}")
    private String domainId;

    /**
     * 도메인 명
     */
    @NotNull(message = "{tps.domain.error.invalid.domainName1}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.domainName1}")
    @Length(min = 1, max = 64, message = "{tps.domain.error.invalid.domainName2}")
    private String domainName;

    /**
     * 도메인 url
     */
    @NotNull(message = "{tps.domain.error.invalid.domainUrl1}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.domainUrl1}")
    @Length(min = 1, max = 512, message = "{tps.domain.error.invalid.domainUrl2}")
    private String domainUrl;

    /**
     * 서비스 플랫폼 P : PC, M : 모바일
     */
    @NotNull(message = "{tps.domain.error.invalid.servicePlatform}")
    @Pattern(regexp = "[P|M]{1}$", message = "{tps.domain.error.invalid.servicePlatform}")
    private String servicePlatform;

    /**
     * 사용여부 Y : 예, N : 아니오
     */
    @NotNull(message = "{tps.domain.error.invalid.useYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.domain.error.invalid.useYn}")
    private String useYn;

    /**
     * 언어
     */
    @Length(min = 0, max = 3, message = "{tps.domain.error.invalid.lang}")
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
    private String apiCodeId;		// apiHost + apiPath

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
