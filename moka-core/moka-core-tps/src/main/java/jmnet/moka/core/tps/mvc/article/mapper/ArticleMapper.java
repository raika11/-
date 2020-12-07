package jmnet.moka.core.tps.mvc.article.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleBasicVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleDetailVO;

/**
 * Article Mapper
 *
 * @author jeon0525
 */
public interface ArticleMapper extends BaseMapper<ArticleBasicVO, ArticleSearchDTO> {

    ArticleDetailVO findArticleDetailById(Long totalId);
}
