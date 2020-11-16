/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan. 
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna. 
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus. 
 * Vestibulum commodo. Ut rhoncus gravida arcu. 
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageSearchDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Description: 기사페이지 RepositorySupport
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
public interface ArticlePageRepositorySupport {

    /**
     * 기사페이지 목록 조회
     * @param search 검색조건
     * @param pageable 페이징
     * @return 기사페이지목록
     */
    Page<ArticlePage> findList(ArticlePageSearchDTO search, Pageable pageable);

}
