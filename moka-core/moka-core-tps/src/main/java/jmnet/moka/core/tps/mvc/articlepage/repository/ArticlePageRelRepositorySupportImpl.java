/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan. 
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna. 
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus. 
 * Vestibulum commodo. Ut rhoncus gravida arcu. 
 */

package jmnet.moka.core.tps.mvc.articlepage.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.articlepage.entity.ArticlePageRel;
import jmnet.moka.core.tps.mvc.articlepage.entity.QArticlePage;
import jmnet.moka.core.tps.mvc.articlepage.entity.QArticlePageRel;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 * 기사 페이지릴레이션 Repository Support Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 4:01:30
 * @author jeon
 */
public class ArticlePageRelRepositorySupportImpl extends QuerydslRepositorySupport
        implements ArticlePageRelRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ArticlePageRelRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ArticlePageRel.class);
        this.queryFactory = queryFactory;
    }

    @Override
    @Transactional
    public void updateRelTemplates(Component component) {
        QArticlePageRel articlePageRel = QArticlePageRel.articlePageRel;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(articlePageRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
        builder.and(articlePageRel.relParentSeq.eq(component.getComponentSeq()));
        builder.and(articlePageRel.relType.eq(MokaConstants.ITEM_TEMPLATE));

        queryFactory.update(articlePageRel).where(builder)
                .set(articlePageRel.relSeq, component.getTemplate().getTemplateSeq()).execute();
    }

    @Override
    @Transactional
    public void updateRelDatasets(Component newComponent, Component orgComponent) {
        QArticlePageRel articlePageRel = QArticlePageRel.articlePageRel;

        if (!newComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
            // datasetSeq가 변경된 경우: update
            if (!orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(articlePageRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
                builder.and(articlePageRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(articlePageRel.relType.eq(MokaConstants.ITEM_DATASET));

                queryFactory.update(articlePageRel).where(builder)
                        .set(articlePageRel.relSeq, newComponent.getDataset().getDatasetSeq()).execute();
            } else {
                // datasetSeq가 추가된 경우: select -> insert
                // ContainerServiceImpl에서 처리
            }

        } else {
            // datasetSeq가 있다가 삭제된 경우: delete
            if (!orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(articlePageRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
                builder.and(articlePageRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(articlePageRel.relType.eq(MokaConstants.ITEM_DATASET));

                queryFactory.delete(articlePageRel).where(builder).execute();
            }
        }
    }

    @Override
    public List<ArticlePageRel> findList(String relType, Long relSeq) {
        QArticlePageRel articlePageRel = QArticlePageRel.articlePageRel;
        QArticlePage articlePage = QArticlePage.articlePage;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(articlePageRel.relType.eq(relType));
        builder.and(articlePageRel.relSeq.eq(relSeq));

        JPQLQuery<ArticlePageRel> query = queryFactory
                .select(Projections.fields(ArticlePageRel.class, articlePage.as("articlePage"), domain.as("domain"),
                    articlePageRel.relType.as("relType"), articlePageRel.relSeq.as("relSeq"),
                    articlePageRel.relOrd.as("relOrd")))
                .distinct().from(articlePageRel).where(builder).join(domain)
                .on(articlePageRel.domain.domainId.eq(domain.domainId)).fetchJoin().join(articlePage)
                .on(articlePageRel.articlePage.artPageSeq.eq(articlePage.artPageSeq)).fetchJoin();
        return query.fetch();
    }
}
