package jmnet.moka.core.tps.mvc.article.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.article.dto.ArticleSearchDTO;
import jmnet.moka.core.tps.mvc.article.entity.Article;
import jmnet.moka.core.tps.mvc.article.vo.ArticleVO;

/**
 * Article 서비스
 * 
 * @author jeon0525
 *
 */
public interface ArticleService {

    /**
     * 기사목록 조회(Mybatis)
     * 
     * @param search 검색조건
     * @return 목록
     */
    public List<ArticleVO> findList(ArticleSearchDTO search);

    /**
     * 기사목록 카운트 조회(Mybatis)
     * 
     * @param search 검색조건
     * @return 카운트
     */
    public Long findListCount(ArticleSearchDTO search);

    /**
     * 기사 단건 조회
     * 
     * @param contentsId 컨텐츠ID
     * @return optinal 기사
     */
    public Optional<Article> findByContentsId(String contentsId);
}
