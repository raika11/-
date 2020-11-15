/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.relation.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.articlepage.vo.ArticlePageVO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-10-29
 */
public interface RelationService {
    /**
     * 관련 페이지 목록 조회
     *
     * @param search 검색조건
     * @return 페이지목록
     */
    List<PageVO> findAllPage(RelationSearchDTO search);

    List<ArticlePageVO> findAllArticlePage(RelationSearchDTO search);

    Page<Container> findAllContainer(RelationSearchDTO search, Pageable pageable);

    Page<Component> findAllComponent(RelationSearchDTO search, Pageable pageable);
    //    List<ComponentVO> findAllComponent(RelationSearchDTO search);

    Boolean hasRelations(Long seq, String itemType);

    Boolean isRelatedDomain(String domainId);
}
