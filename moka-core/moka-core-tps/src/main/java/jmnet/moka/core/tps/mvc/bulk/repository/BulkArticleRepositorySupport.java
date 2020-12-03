package jmnet.moka.core.tps.mvc.bulk.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticle;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticlePK;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.naverbulk.repository
 * ClassName : BulkRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public interface BulkArticleRepositorySupport {
    public List<BulkArticle> findAllByBulkartSeq(BulkArticlePK bulkArticlePK);
}
