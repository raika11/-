package jmnet.moka.core.tps.mvc.template.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.TemplateItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 템플릿 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("템플릿 DTO")
public class TemplateDTO implements Serializable {

    private static final long serialVersionUID = -5201094233356691956L;

    public static final Type TYPE = new TypeReference<List<TemplateDTO>>() {}.getType();

    @ApiModelProperty("템플릿SEQ")
    @Min(value = 0, message = "{tps.template.error.min.templateSeq}")
    private Long templateSeq;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("템플릿명(필수)")
    @NotNull(message = "{tps.template.error.notnull.templateName}")
    @Pattern(regexp = ".+", message = "{tps.template.error.pattern.templateName}")
    @Length(min = 1, max = 128, message = "{tps.template.error.length.templateName}")
    private String templateName;

    @ApiModelProperty("tems 소스")
    @Builder.Default
    private String templateBody = "";

    @ApiModelProperty("크롭 가로")
    @Builder.Default
    private Integer cropWidth = 0;

    @ApiModelProperty("크롭 세로")
    @Builder.Default
    private Integer cropHeight = 0;

    @ApiModelProperty("템플릿그룹")
    @Length(max = 24, message = "{tps.template.error.length.templateGroup}")
    private String templateGroup;

    @ApiModelProperty("템플릿가로")
    @Builder.Default
    private Integer templateWidth = 0;

    @ApiModelProperty("템플릿썸네일")
    @Length(max = 256, message = "{tps.template.error.length.templateThumb}")
    private String templateThumb;

    @ApiModelProperty("상세정보")
    @Length(max = 4000, message = "{tps.template.error.length.description}")
    private String description;

    public TemplateItem toTemplateItem() {
        TemplateItem templateItem = new TemplateItem();
        templateItem.put(ItemConstants.TEMPLATE_ID, this.templateSeq);
        templateItem.put(ItemConstants.TEMPLATE_DOMAIN_ID, this.domain.getDomainId());
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
