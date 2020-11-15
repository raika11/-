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
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.merge.item.PageItem;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageRel;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
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
public class ArticlePageDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticlePageDTO>>() {
    }.getType();

    /**
     * 기사페이지SEQ
     */
    @Min(value = 0, message = "{tps.article-page.error.min.artPageSeq}")
    private Long artPageSeq;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    /**
     * 기사페이지명
     */
    @NotNull(message = "{tps.article-page.error.notnull.artPageName}")
    @Pattern(regexp = ".+", message = "{tps.article-page.error.pattern.artPageName}")
    @Length(min = 1, max = 128, message = "{tps.article-page.error.length.artPageName}")
    private String artPageName;

    /**
     * 서비스유형(기타코드)
     */
    @Length(max = 24, message = "{tps.article-page.error.length.artType}")
    private String artType;

    /**
     * 기사페이지본문
     */
    @Builder.Default
    private String artPageBody = "";

//    public ArticlePageItem toArticlePageItem() {
//        ArticlePageItem item = new ArticlePageItem();
//        item.put(ItemConstants.PAGE_ID, this.pageSeq);
//        item.put(ItemConstants.PAGE_DOMAIN_ID, this.domain.getDomainId());
//        item.put(ItemConstants.PAGE_NAME, this.pageName);
//        item.put(ItemConstants.PAGE_SERVICE_NAME, this.pageServiceName);
//        item.put(ItemConstants.PAGE_DISPLAY_NAME, this.pageDisplayName);
//        item.put(ItemConstants.PAGE_PARENT_ID, this.parent != null ? this.parent.getPageSeq() : null);
//        return item;
//    }
}
