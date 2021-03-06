/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.articlepage.dto;

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
import jmnet.moka.core.tms.merge.item.ArticlePageItem;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 기사페이지 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "artPageSeq")
@ApiModel("기사페이지 DTO")
public class ArticlePageDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticlePageDTO>>() {
    }.getType();

    @ApiModelProperty("기사페이지SEQ")
    @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}")
    private Long artPageSeq;

    @ApiModelProperty("도메인(필수)")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("기사페이지명(필수)")
    @NotNull(message = "{tps.article-page.error.notnull.artPageName}")
    @Pattern(regexp = ".+", message = "{tps.article-page.error.pattern.artPageName}")
    @Length(min = 1, max = 128, message = "{tps.article-page.error.length.artPageName}")
    private String artPageName;

    @ApiModelProperty("서비스유형(기타코드 SVC_AT)")
    @Length(max = 24, message = "{tps.article-page.error.length.artTypes}")
    private String artTypes;

    @ApiModelProperty("미리보기용 기사ID, 상세조회시에만 사용")
    private Long previewTotalId;

    @ApiModelProperty("tems 소스")
    @Builder.Default
    private String artPageBody = "";

    public ArticlePageItem toArticlePageItem() {
        ArticlePageItem item = new ArticlePageItem();
        item.put(ItemConstants.ARTICLE_PAGE_ID, this.artPageSeq);
        item.put(ItemConstants.ARTICLE_PAGE_DOMAIN_ID, this.domain.getDomainId());
        item.put(ItemConstants.ARTICLE_PAGE_TYPES, this.artTypes);
        item.put(ItemConstants.ARTICLE_PAGE_NAME, this.artPageName);
        item.put(ItemConstants.ARTICLE_PAGE_BODY, this.artPageBody);
        return item;
    }
}
