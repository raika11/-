package jmnet.moka.core.tps.mvc.page.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
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
public class PageDTO implements Serializable {

    private static final long serialVersionUID = 8547732591705087157L;

    public static final Type TYPE = new TypeReference<List<PageDTO>>() {
    }.getType();

    /**
     * 페이지SEQ
     */
    @Min(value = 0, message = "{tps.page.error.min.pageSeq}")
    private Long pageSeq;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    /**
     * 페이지명
     */
    @NotNull(message = "{tps.page.error.notnull.pageName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageName}")
    @Length(min = 1, max = 256, message = "{tps.page.error.length.pageName}")
    private String pageName;

    /**
     * 페이지서비스명
     */
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_NAME_PATTERN, message = "{tps.page.error.pattern.pageServiceName}")
    @Length(max = 256, message = "{tps.page.error.length.pageServiceName}")
    private String pageServiceName;

    /**
     * 페이지표출명
     */
    @Length(max = 256, message = "{tps.page.error.length.pageServiceName}")
    private String pageDisplayName;

    /**
     * 부모페이지
     */
    @ToString.Exclude
    private ParentPageDTO parent;

    /**
     * 페이지유형 text/html, application/json, text/javascript, text/plain, text/xml
     */
    @NotNull(message = "{tps.page.error.notnull.pageType}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageType}")
    @Length(min = 1, max = 24, message = "{tps.page.error.length.pageType}")
    @Builder.Default
    private String pageType = TpsConstants.PAGE_TYPE_HTML;

    /**
     * 페이지URL
     */
    @NotNull(message = "{tps.page.error.notnull.pageUrl}")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.pageUrl}")
    @Length(min = 1, max = 512, message = "{tps.page.error.length.pageUrl}")
    private String pageUrl;

    /**
     * 페이지순서
     */
    @NotNull(message = "{tps.page.error.notnull.pageOrd}")
    @Min(value = 1, message = "{tps.page.error.min.pageOrd}")
    @Builder.Default
    private Integer pageOrd = 1;

    /**
     * 페이지본문
     */
    @Builder.Default
    private String pageBody = "";

    /**
     * URL파라미터
     */
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.urlParam}")
    @Length(max = 64, message = "{tps.page.error.length.urlParam}")
    private String urlParam;

    /**
     * 사용여부
     */
    @NotNull(message = "{tps.page.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 파일여부
     */
    @NotNull(message = "{tps.page.error.notnull.fileYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.fileYn}")
    @Builder.Default
    private String fileYn = MokaConstants.NO;

    /**
     * 키워드
     */
    @Length(max = 128, message = "{tps.page.error.len.kwd}")
    private String kwd;

    /**
     * 카테고리
     */
    @Length(max = 256, message = "{tps.page.error.len.category}")
    private String category;

    /**
     * 상세정보
     */
    @Length(max = 4000, message = "{tps.page.error.len.description}")
    private String description;

    /**
     * 이동여부
     */
    @NotNull(message = "{tps.page.error.notnull.moveYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.moveYn}")
    @Builder.Default
    private String moveYn = MokaConstants.NO;

    /**
     * 이동URL
     */
    @Length(max = 512, message = "{tps.page.error.len.moveUrl}")
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
