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

    /**
     * 템플릿SEQ
     */
    private Long templateSeq;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.page.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    /**
     * 템플릿명
     */
    @NotNull(message = "{tps.template.error.invalid.templateName}")
    @Pattern(regexp = ".+", message = "{tps.template.error.invalid.templateName}")
    private String templateName;

    /**
     * 템플릿본문
     */
    @Builder.Default
    private String templateBody = "";

    /**
     * 크롭 가로
     */
    @Builder.Default
    private Integer cropWidth = 0;

    /**
     * 크롭 세로
     */
    @Builder.Default
    private Integer cropHeight = 0;

    /**
     * 템플릿그룹
     */
    private String templateGroup;

    /**
     * 템플릿가로
     */
    @Builder.Default
    private Integer templateWidth = 0;

    /**
     * 템플릿썸네일경로
     */
    private String templateThumb;

    /**
     * 상세정보
     */
    @Length(max = 4000, message = "{tps.template.error.invalid.description}")
    private String description;

    /**
     * 템플릿썸네일파일
     */
    private MultipartFile templateThumbnailFile;

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
