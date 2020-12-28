package jmnet.moka.core.tps.mvc.sns.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.sns.dto.ArticleSnsShareMetaSearchDTO;
import jmnet.moka.core.tps.mvc.sns.entity.ArticleSnsShare;
import jmnet.moka.core.tps.mvc.sns.entity.QArticleSnsShare;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.repository.EntityGraph;

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
public class ArticleSnsShareRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ArticleSnsShareRepositorySupport {

    public ArticleSnsShareRepositorySupportImpl() {
        super(ArticleSnsShare.class);
    }

    @Override
    @EntityGraph(attributePaths = {"articleBasic"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<ArticleSnsShare> findAllArticleSnsShare(ArticleSnsShareMetaSearchDTO search) {
        QArticleSnsShare qArticleSnsShare = QArticleSnsShare.articleSnsShare;


        JPQLQuery<ArticleSnsShare> query = from(qArticleSnsShare);
        if (McpString.isNotEmpty(search.getKeyword())) {
            if (qArticleSnsShare.artTitle
                    .getMetadata()
                    .getName()
                    .equals(search.getSearchType())) {
                query.where(qArticleSnsShare.artTitle
                        .contains(search.getKeyword())
                        .or(qArticleSnsShare.articleBasic.artTitle.contains(search.getKeyword())));
            }
            if (qArticleSnsShare.id.totalId
                    .getMetadata()
                    .getName()
                    .equals(search.getSearchType())) {
                query.where(qArticleSnsShare.id.totalId.eq(Long.parseLong(search.getKeyword())));
            }
        }

        if (McpString.isNotEmpty(search.getSnsType())) {
            query.where(qArticleSnsShare.id.snsType.eq(search.getSnsType()));
        }


        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(search.getPageable(), query);
        }


        QueryResults<ArticleSnsShare> list = query
                .join(qArticleSnsShare.articleBasic)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<ArticleSnsShare>(list.getResults(), search.getPageable(), list.getTotal());
    }
}
