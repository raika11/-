/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.articlepage.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageSearchDTO;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageHist;
import jmnet.moka.core.tps.mvc.articlepage.vo.ArticlePageVO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Description: 기사페이지 서비스
 *
 * @author ohtah
 * @since 2020. 11. 14.
 */
public interface ArticlePageService {

    /**
     * 기사페이지 목록조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 기사페이지 목록
     */
    Page<ArticlePage> findAllArticlePage(ArticlePageSearchDTO search, Pageable pageable);

    /**
     * 기사페이지 상세조회
     *
     * @param artPageSeq 기사페이지 순번
     * @return 기사페이지
     */
    Optional<ArticlePage> findArticlePageBySeq(Long artPageSeq);

    /**
     * 기사페이지 등록
     *
     * @param articlePage 등록할 기사페이지 정보
     * @return ArticlePage
     * @throws IOException            입출력오류
     * @throws TemplateParseException 본문 문법오류
     */
    ArticlePage insertArticlePage(ArticlePage articlePage)
            throws IOException, TemplateParseException;

    /**
     * 관련기사페이지 목록조회(부모찾기)
     *
     * @param search 검색조건
     * @return 기사페이지목록
     */
    List<ArticlePageVO> findAllArticlePageRel(RelationSearchDTO search);

    /**
     * 관련기사페이지 건수
     *
     * @param search 검색조건
     * @return 관련기사페이지 건수
     */
    Long countArticlePageRel(RelationSearchDTO search);

    /**
     * 해당 도메인의 기사페이지 건수(도메인 관련조사시 사용)
     *
     * @param domainId 도메인아이디
     * @return 기사페이지 건수
     */
    int countArticlePageByDomainId(String domainId);

    /**
     * 컴포넌트정보 변경에 따른, 관련아이템 업데이트
     *
     * @param newComponent 변경된 컴포넌트
     * @param orgComponent 원본 컴포넌트
     */
    void updateArticlePageRelItems(Component newComponent, Component orgComponent);

    /**
     * 히스토리 상세조회
     *
     * @param histSeq 이력 일련번호
     * @return ArticlePageHist
     */
    Optional<ArticlePageHist> findArticlePageHistBySeq(Long histSeq);

    /**
     * 기사페이지 수정
     *
     * @param articlePage 수정할 기사페이지
     * @return 수정된 기사페이지
     */
    ArticlePage updateArticlePage(ArticlePage articlePage)
            throws Exception;

    /**
     * 기사페이지
     *
     * @param articlePage ArticlePage
     */
    void deleteArticlePage(ArticlePage articlePage);

    /**
     * 같은 기사페이지 일련번호에 기사 타입이 중복으로 있는지 체크
     *
     * @param domainId 도메인ID
     * @param artType  기사 유형
     */
    boolean existArtType(String domainId, String artType);

    /**
     * 유형에 해당하는 기사페이지 조회
     *
     * @param domainId       도메인ID
     * @param defaultArtType 유형
     * @return 기사페이지
     */
    ArticlePage findByArticePageByArtType(String domainId, String defaultArtType);
}
