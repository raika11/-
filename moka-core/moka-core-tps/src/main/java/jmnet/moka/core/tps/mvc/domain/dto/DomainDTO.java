package jmnet.moka.core.tps.mvc.domain.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.DomainItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 도메인 DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 1:32:16
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DomainDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722632117L;

    public static final Type TYPE = new TypeReference<List<DomainDTO>>() {}.getType();

    @NotNull(message = "{tps.domain.error.invalid.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.invalid.domainId}")
    private String domainId;

    @NotNull(message = "{tps.domain.error.invalid.domainName1}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.domainName1}")
    @Length(min = 1, max = 64, message = "{tps.domain.error.invalid.domainName2}")
    private String domainName;

    @NotNull(message = "{tps.domain.error.invalid.domainUrl1}")
    @Pattern(regexp = ".+", message = "{tps.domain.error.invalid.domainUrl1}")
    @Length(min = 1, max = 512, message = "{tps.domain.error.invalid.domainUrl2}")
    private String domainUrl;

    @NotNull(message = "{tps.domain.error.invalid.servicePlatform}")
    @Pattern(regexp = "[P|M]{1}$", message = "{tps.domain.error.invalid.servicePlatform}")
    private String servicePlatform;

    @NotNull(message = "{tps.domain.error.invalid.useYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.domain.error.invalid.useYn}")
    private String useYn;

    @NotNull(message = "{tps.domain.error.invalid.mediaId1}")
    @Length(min = 1, max = 2, message = "{tps.domain.error.invalid.mediaId2}")
    private String mediaId;

    @Length(min = 0, max = 3, message = "{tps.domain.error.invalid.lang}")
    private String lang;

    private String apiHost;

    private String apiPath;
    
    private String apiCodeId;		// apiHost + apiPath

    private String description;

//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = MspConstants.JSON_DATE_FORMAT, timezone = MspConstants.JSON_DATE_TIME_ZONE)
//    @DateTimeFormat(pattern = MspConstants.JSON_DATE_FORMAT)
//    private Date regDt;

    public DomainItem toDomainItem() {
        DomainItem domainItem = new DomainItem();
        domainItem.put(ItemConstants.DOMAIN_ID, this.domainId);
        domainItem.put(ItemConstants.DOMAIN_MEDIA_ID, this.mediaId);
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
