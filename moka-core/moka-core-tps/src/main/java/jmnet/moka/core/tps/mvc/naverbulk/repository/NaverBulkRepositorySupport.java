package jmnet.moka.core.tps.mvc.naverbulk.repository;

import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.Article;
import org.springframework.data.domain.Page;

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
public interface NaverBulkRepositorySupport {

    /**
     * 네이버벌크문구 목록검색
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    public Page<Article> findAllNaverBulkList(NaverBulkSearchDTO searchDTO);

    public void updateArticle(Article article);


}
