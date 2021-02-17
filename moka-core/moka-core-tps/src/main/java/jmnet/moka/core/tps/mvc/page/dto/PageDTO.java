package jmnet.moka.core.tps.mvc.page.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

/**
 * 페이지 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "pageSeq")
@ApiModel("페이지 DTO")
public class PageDTO implements Serializable {

    private static final long serialVersionUID = 8547732591705087157L;

    public static final Type TYPE = new TypeReference<List<PageDTO>>() {
    }.getType();

    @ApiModelProperty("페이지SEQ")
    @Min(value = 0, message = "{tps.page.error.min.pageSeq}")
    private Long pageSeq;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("페이지명(필수)")
    @NotNull(message = "{tps.page.error.notnull.pageName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageName}")
    @Length(min = 1, max = 256, message = "{tps.page.error.length.pageName}")
    private String pageName;

    @ApiModelProperty("페이지서비스명")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_NAME_PATTERN, message = "{tps.page.error.pattern.pageServiceName}")
    @Length(max = 256, message = "{tps.page.error.length.pageServiceName}")
    private String pageServiceName;

    @ApiModelProperty("페이지표출명")
    @Length(max = 256, message = "{tps.page.error.length.pageServiceName}")
    private String pageDisplayName;

    @ApiModelProperty("부모페이지")
    @ToString.Exclude
    private ParentPageDTO parent;

    @ApiModelProperty("페이지유형(필수)")
    @NotNull(message = "{tps.page.error.notnull.pageType}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageType}")
    @Length(min = 1, max = 24, message = "{tps.page.error.length.pageType}")
    @Builder.Default
    private String pageType = TpsConstants.PAGE_TYPE_HTML;

    @ApiModelProperty("페이지URL(필수)")
    @NotNull(message = "{tps.page.error.notnull.pageUrl}")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.pageUrl}")
    @Length(min = 1, max = 512, message = "{tps.page.error.length.pageUrl}")
    private String pageUrl;

    @ApiModelProperty("페이지순서(필수)")
    @NotNull(message = "{tps.page.error.notnull.pageOrd}")
    @Min(value = 1, message = "{tps.page.error.min.pageOrd}")
    @Builder.Default
    private Integer pageOrd = 1;

    @ApiModelProperty("페이지 tems소스")
    @Builder.Default
    private String pageBody = "";

    @ApiModelProperty("URL파라미터")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\/]*$", message = "{tps.page.error.pattern.urlParam}")
    @Length(max = 64, message = "{tps.page.error.length.urlParam}")
    private String urlParam;

    @ApiModelProperty("사용여부(필수)")
    @NotNull(message = "{tps.page.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    @ApiModelProperty("파일여부(필수)")
    @NotNull(message = "{tps.page.error.notnull.fileYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.fileYn}")
    @Builder.Default
    private String fileYn = MokaConstants.NO;

    @ApiModelProperty("키워드")
    @Length(max = 128, message = "{tps.page.error.len.kwd}")
    private String kwd;

    @ApiModelProperty("카테고리")
    @Length(max = 256, message = "{tps.page.error.len.category}")
    private String category;

    @ApiModelProperty("상세정보")
    @Length(max = 4000, message = "{tps.page.error.len.description}")
    private String description;

    @ApiModelProperty("이동여부")
    @NotNull(message = "{tps.page.error.notnull.moveYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.moveYn}")
    @Builder.Default
    private String moveYn = MokaConstants.NO;

    @ApiModelProperty("이동URL")
    @Length(max = 512, message = "{tps.page.error.len.moveUrl}")
    private String moveUrl;

    public PageItem toPageItem() {
        PageItem pageItem = new PageItem();
        pageItem.put(ItemConstants.PAGE_ID, this.pageSeq);
        pageItem.put(ItemConstants.PAGE_DOMAIN_ID, this.domain.getDomainId());
        pageItem.put(ItemConstants.PAGE_NAME, this.pageName);
        pageItem.put(ItemConstants.PAGE_SERVICE_NAME, this.pageServiceName);
        pageItem.put(ItemConstants.PAGE_DISPLAY_NAME, this.pageDisplayName);
        pageItem.put(ItemConstants.PAGE_PARENT_ID, this.parent != null ? this.parent.getPageSeq() : null);
        pageItem.put(ItemConstants.PAGE_TYPE, this.pageType);
        pageItem.put(ItemConstants.PAGE_URL, this.pageUrl);
        pageItem.put(ItemConstants.PAGE_ORDER, this.pageOrd);
        pageItem.put(ItemConstants.PAGE_BODY, this.pageBody);
        pageItem.put(ItemConstants.PAGE_URL_PARAM, this.urlParam);
        pageItem.put(ItemConstants.PAGE_USE_YN, this.usedYn);
        pageItem.put(ItemConstants.PAGE_FILE_YN, this.fileYn);
        pageItem.put(ItemConstants.PAGE_KEYWORD, this.kwd);
        pageItem.put(ItemConstants.PAGE_CATEGORY, this.category);
        pageItem.put(ItemConstants.PAGE_DESCRIPTION, this.description);
        pageItem.put(ItemConstants.PAGE_MOVE_YN, this.moveYn);
        pageItem.put(ItemConstants.PAGE_MOVE_URL, this.moveUrl);
        return pageItem;
    }
}
