package jmnet.moka.core.tps.mvc.page.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "pageSeq")
public class PageDTO implements Serializable {

    private static final long serialVersionUID = 8547732591705087157L;

    public static final Type TYPE = new TypeReference<List<PageDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.page.error.invalid.pageSeq}")
    private Long pageSeq;

    @NotNull(message = "{tps.page.error.invalid.pageName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.invalid.pageName}")
    private String pageName;

    @Pattern(regexp = MokaConstants.PAGE_SERVICE_NAME_PATTERN,
            message = "{tps.page.error.invalid.pageServiceName}")
    private String pageServiceName;

    private String pageDisplayName;

    @ToString.Exclude
    private ParentPageDTO parent;

    @NotNull(message = "{tps.page.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.page.error.invalid.pageType}")
    @Pattern(regexp = ".+", message = "{tps.page.error.invalid.pageType}")
    private String pageType;

    @NotNull(message = "{tps.page.error.invalid.pageUrl}")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN,
            message = "{tps.page.error.invalid.pageUrl2}")
    private String pageUrl;

    @NotNull(message = "{tps.page.error.invalid.pageOrder}")
    @Min(value = -1, message = "{tps.page.error.invalid.pageOrder}")
    private int pageOrder;

    private String pageBody;

    @NotNull(message = "{tps.page.error.invalid.useYn}}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.invalid.useYn}")
    private String useYn;

    @Length(max = 128, message = "{tps.page.error.invalid.keyword}")
    private String keyword;

    private String description;

    @NotNull(message = "{tps.page.error.invalid.moveYn}}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.invalid.moveYn}")
    private String moveYn;

    @Length(max = 512, message = "{tps.page.error.invalid.moveUrl}")
    private String moveUrl;

    // @Builder.Default
    // private Set<PageRelationDTO> pageRelations = new LinkedHashSet<PageRelationDTO>();
    //
    // public void addPageRelation(PageRelationDTO relation) {
    //
    // if (relation.getPage() == null) {
    // relation.setPage(this);
    // return;
    // }
    //
    // if (pageRelations.contains(relation)) {
    // return;
    // } else {
    // this.pageRelations.add(relation);
    // }
    // }

    public PageItem toPageItem() {
        PageItem pageItem = new PageItem();
        pageItem.put(ItemConstants.PAGE_ID, this.pageSeq);
        pageItem.put(ItemConstants.PAGE_DOMAIN_ID, this.domain.getDomainId());
        pageItem.put(ItemConstants.PAGE_NAME, this.pageName);
        pageItem.put(ItemConstants.PAGE_SERVICE_NAME, this.pageServiceName);
        pageItem.put(ItemConstants.PAGE_DISPLAY_NAME, this.pageDisplayName);
        pageItem.put(ItemConstants.PAGE_DISPLAY_NAME, this.pageDisplayName);
        pageItem.put(ItemConstants.PAGE_PARENT_ID,
                this.parent != null ? this.parent.getPageSeq() : null);
        pageItem.put(ItemConstants.PAGE_TYPE, this.pageType);
        pageItem.put(ItemConstants.PAGE_URL, this.pageUrl);
        pageItem.put(ItemConstants.PAGE_ORDER, this.pageOrder);
        pageItem.put(ItemConstants.PAGE_BODY, this.pageBody);
        pageItem.put(ItemConstants.PAGE_USE_YN, this.useYn);
        pageItem.put(ItemConstants.PAGE_DESCRIPTION, this.description);
        pageItem.put(ItemConstants.PAGE_MOVE_YN, this.moveYn);
        pageItem.put(ItemConstants.PAGE_MOVE_URL, this.moveUrl);
        return pageItem;
    }
}
