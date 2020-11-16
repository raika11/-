/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan. 
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna. 
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus. 
 * Vestibulum commodo. Ut rhoncus gravida arcu. 
 */

package jmnet.moka.core.tps.mvc.articlepage.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 11. 15.
 */
@Alias("ArticlePageVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticlePageVO {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticlePageVO>>() {}.getType();

    @Column(name = "ART_PAGE_SEQ")
    private Long artPageSeq;

    @Column(name = "ART_PAGE_NAME")
    private String artPageName;

    private DomainSimpleDTO domain;

    @Column(name = "ART_TYPE")
    private String artType;

    @Column(name = "ART_TYPE_NAME")
    private String artTypeName;
}
