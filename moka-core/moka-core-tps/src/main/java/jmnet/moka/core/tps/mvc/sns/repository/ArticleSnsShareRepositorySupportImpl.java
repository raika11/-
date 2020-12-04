package jmnet.moka.core.tps.mvc.sns.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.QArticleSnsShare;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.repository
 * ClassName : ArticleSnsShareRepositorySupportImpl
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 14:20
 */
public class ArticleSnsShareRepositorySupportImpl extends QuerydslRepositorySupport implements ArticleSnsShareRepositorySupport {

    public ArticleSnsShareRepositorySupportImpl() {
        super(ArticleSnsShare.class);
    }

    @Override
    public Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareSearchDTO search) {
        QArticleSnsShare qArticleSnsShare = QArticleSnsShare.articleSnsShare;


        JPQLQuery<ArticleSnsShare> query = from(qArticleSnsShare);

        // 에피소드명
        if (McpString.isNotEmpty(search.getKeyword())) {
            query.where(qArticleSnsShare.artTitle.contains(search.getKeyword()));
        }

        // 에피소드명
        if (search.getTotalId() > 0) {
            query.where(qArticleSnsShare.snsArtId.eq(String.valueOf(search.getTotalId())));
        }

        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(search.getPageable(), query);
        }


        QueryResults<ArticleSnsShare> list = query.fetchResults();

        return new PageImpl<ArticleSnsShare>(list.getResults(), search.getPageable(), list.getTotal());
    }
}
