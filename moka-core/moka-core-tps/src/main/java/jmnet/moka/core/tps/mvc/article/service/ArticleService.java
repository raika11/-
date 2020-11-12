package jmnet.moka.core.tps.mvc.article.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;

/**
 * Article 서비스
 *
 * @author jeon0525
 */
public interface ArticleService {
    List<ArticleBasicVO> findAllArticleBasic(ArticleSearchDTO search);

    Optional<ArticleBasic> findArticleBasicById(Long totalId);

}
