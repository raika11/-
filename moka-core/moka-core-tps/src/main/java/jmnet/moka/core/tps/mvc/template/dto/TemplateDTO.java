package jmnet.moka.core.tps.mvc.template.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.TemplateItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 템플릿 DTO
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 1. 14. 오후 1:33:28
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateDTO implements Serializable {

    private static final long serialVersionUID = -5201094233356691956L;

    public static final Type TYPE = new TypeReference<List<TemplateDTO>>() {}.getType();

    private Long templateSeq;

    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.template.error.invalid.templateName}")
    @Pattern(regexp = ".+", message = "{tps.template.error.invalid.templateName}")
    private String templateName;

    private String templateBody;

    private Integer cropWidth;

    private Integer cropHeight;

    private String templateGroup;

    private Integer templateWidth;

    private String templateThumb;

    @Length(max = 4000, message = "{tps.template.error.invalid.description}")
    private String description;

    private MultipartFile templateThumbnailFile;

    public TemplateItem toTemplateItem() {
        TemplateItem templateItem = new TemplateItem();
        templateItem.put(ItemConstants.TEMPLATE_ID, this.templateSeq);
//        templateItem.put(ItemConstants.TEMPLATE_DOMAIN_ID, this.domain.getDomainId());
        templateItem.put(ItemConstants.TEMPLATE_NAME, this.templateName);
        templateItem.put(ItemConstants.TEMPLATE_BODY, this.templateBody);
        templateItem.put(ItemConstants.TEMPLATE_CROP_WIDTH, this.cropWidth);
        templateItem.put(ItemConstants.TEMPLATE_CROP_HEIGHT, this.cropHeight);
        templateItem.put(ItemConstants.TEMPLATE_GROUP, this.templateGroup);
        templateItem.put(ItemConstants.TEMPLATE_WIDTH, this.templateWidth);
        templateItem.put(ItemConstants.TEMPLATE_DESCRIPTION, this.description);
        return templateItem;
    }
}
