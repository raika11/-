/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.bulk.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticle;
import jmnet.moka.core.tps.mvc.bulk.entity.BulkArticlePK;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *  벌크 문구 목록 Repository
 * 2020. 11. 10. ssc 최초생성
 * </pre>
 * <p>
 * 2020. 11. 10. 오후 2:04:49
 *
 * @author ssc
 */
@Repository
public interface BulkArticleRepository
        extends CrudRepository<BulkArticle, BulkArticlePK>, JpaSpecificationExecutor<BulkArticle>, BulkArticleRepositorySupport {
    public List<BulkArticle> findAllByBulkartSeq(BulkArticlePK bulkArticlePK);
}
