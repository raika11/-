package jmnet.moka.core.tps.mvc.naverbulk.repository;

import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.Article;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticleList;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticlePK;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.naverbulk.repository
 * ClassName : NaverBulkRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public interface NaverBulkListRepositorySupport {
    public List<ArticleList> findAllByClickartSeq(ArticlePK articlePK);
}
