package jmnet.moka.core.tps.mvc.sns.repository;

import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticleSnsShareRepository
        extends JpaRepository<ArticleSnsShare, String>, JpaSpecificationExecutor<ArticleSnsShare>, ArticleSnsShareRepositorySupport {

}
