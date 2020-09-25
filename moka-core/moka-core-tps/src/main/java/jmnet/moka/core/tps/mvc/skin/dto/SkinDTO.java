package jmnet.moka.core.tps.mvc.skin.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.ContentSkinItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.style.dto.StyleSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "skinSeq")
public class SkinDTO implements Serializable {

    private static final long serialVersionUID = 3390047643803594832L;

    public static final Type TYPE = new TypeReference<List<SkinDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.skin.error.invalid.skinSeq}")
    private Long skinSeq;

    @NotNull(message = "{tps.skin.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.skin.error.invalid.skinName}")
    @Pattern(regexp = ".+", message = "{tps.skin.error.invalid.skinName}")
    private String skinName;

    @NotNull(message = "{tps.skin.error.invalid.skinServiceName}")
    @Pattern(regexp = ".+", message = "{tps.skin.error.invalid.skinServiceName}")
    private String skinServiceName;

    private String serviceType;

    @NotNull(message = "{tps.skin.error.invalid.defaultYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.skin.error.invalid.defaultYn}")
    private String defaultYn;

    private String skinBody;

    private StyleSimpleDTO style;

    public ContentSkinItem toSkinItem() {
        ContentSkinItem skinItem = new ContentSkinItem();
        skinItem.put(ItemConstants.SKIN_ID, this.skinSeq);
        skinItem.put(ItemConstants.SKIN_DOMAIN_ID, this.getDomain().getDomainId());
        skinItem.put(ItemConstants.SKIN_NAME, this.skinName);
        skinItem.put(ItemConstants.SKIN_SERVICE_TYPE, this.serviceType);
        skinItem.put(ItemConstants.SKIN_DEFAULT_YN, this.defaultYn);
        skinItem.put(ItemConstants.SKIN_BODY, this.skinBody);
        return skinItem;

    }
}
