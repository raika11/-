package jmnet.moka.core.tps.mvc.article.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.article.entity.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    /**
     * 컨텐츠ID로 기사 조회
     * 
     * @param contentsId 컨텐츠ID
     * @return maybe Article
     */
    public Optional<Article> findByContentsId(String contentsId);

}
