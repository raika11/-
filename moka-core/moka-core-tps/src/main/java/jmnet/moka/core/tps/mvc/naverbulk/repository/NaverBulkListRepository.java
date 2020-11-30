/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.naverbulk.repository;

import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticleList;
import jmnet.moka.core.tps.mvc.naverbulk.entity.ArticlePK;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <pre>
 * 네이버 벌크 문구 목록 Repository
 * 2020. 11. 10. ssc 최초생성
 * </pre>
 * 
 * 2020. 11. 10. 오후 2:04:49
 * @author ssc
 */
@Repository
public interface NaverBulkListRepository extends CrudRepository<ArticleList, ArticlePK>
        , JpaSpecificationExecutor<ArticleList>, NaverBulkListRepositorySupport {
    public List<ArticleList> findAllByClickartSeq(ArticlePK articlePK);
}