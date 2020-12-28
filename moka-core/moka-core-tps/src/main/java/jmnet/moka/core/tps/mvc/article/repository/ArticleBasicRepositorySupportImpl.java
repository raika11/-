package jmnet.moka.core.tps.mvc.article.repository;

import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import jmnet.moka.core.tps.mvc.article.entity.QArticleBasic;

/**
 * <pre>
 * ArticleBasicRepositorySupport implemention 클래스
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.article.repository
 * ClassName : ArticleBasicRepositorySupportImpl
 * Created : 2020-12-01 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-01 13:07
 */
public class ArticleBasicRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ArticleBasicRepositorySupport {

    public ArticleBasicRepositorySupportImpl() {
        super(ArticleBasic.class);
    }


    @Override
    public Long findLastestByTotalIdByArtType(String artType) {
        QArticleBasic qArticleBasic = QArticleBasic.articleBasic;

        JPQLQuery<ArticleBasic> query = from(qArticleBasic);

        query.where(qArticleBasic.artType.eq(artType));
        query.where(qArticleBasic.serviceFlag.eq(MokaConstants.YES));
        query.where(qArticleBasic.sourceCode.eq(MokaConstants.SOURCE_CODE_3));

        return query
                .select(qArticleBasic.totalId)
                .orderBy(qArticleBasic.serviceDaytime.desc())
                .fetchFirst();
    }
}
