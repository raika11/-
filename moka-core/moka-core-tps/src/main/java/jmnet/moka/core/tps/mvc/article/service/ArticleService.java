package jmnet.moka.core.tps.mvc.article.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.entity.ArticleSource;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;

/**
 * Article 서비스
 *
 * @author jeon0525
 */
public interface ArticleService {
    List<ArticleBasicVO> findAllArticleBasic(ArticleSearchDTO search);

    /**
     * 기사 상세조회
     *
     * @param totalId 기사아이디
     * @return 기사상세
     */
    Optional<ArticleBasic> findArticleBasicById(Long totalId);

    /**
     * 매체목록 조회
     *
     * @param deskingSourceList 조회할 매체아이디 목록
     * @return
     */
    List<ArticleSource> findAllArticleSource(String[] deskingSourceList);

    void saveArticleTitle(ArticleBasic articleBasic, String title, String mobTitle);
}
