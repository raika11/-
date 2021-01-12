package jmnet.moka.core.tps.mvc.article.repository;

import jmnet.moka.core.tps.mvc.article.entity.ArticleClickcnt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ArticleClickcntRepository
        extends JpaRepository<ArticleClickcnt, Integer>, JpaSpecificationExecutor<ArticleClickcnt>, ArticleClickcntRepositorySupport {

}
