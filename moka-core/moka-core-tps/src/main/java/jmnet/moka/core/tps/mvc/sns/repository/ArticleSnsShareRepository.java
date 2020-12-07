package jmnet.moka.core.tps.mvc.sns.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsSharePK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticleSnsShareRepository
        extends JpaRepository<ArticleSnsShare, ArticleSnsSharePK>, JpaSpecificationExecutor<ArticleSnsShare>, ArticleSnsShareRepositorySupport {

    public List<ArticleSnsShare> findByIdTotalId(Long totalId);

}
