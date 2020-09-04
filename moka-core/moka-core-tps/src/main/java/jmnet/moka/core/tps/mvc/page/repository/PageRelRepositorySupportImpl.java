package jmnet.moka.core.tps.mvc.page.repository;

import java.util.List;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.page.entity.QPage;
import jmnet.moka.core.tps.mvc.page.entity.QPageRel;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.page.entity.PageRel;

/**
 * <pre>
 * 페이지릴레이션 Repository Support Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 4:01:30
 * @author jeon
 */
public class PageRelRepositorySupportImpl extends QuerydslRepositorySupport
        implements PageRelRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public PageRelRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(PageRel.class);
        this.queryFactory = queryFactory;
    }

    @Override
    @Transactional
    public void updateRelTemplates(Component component) {
        QPageRel pageRel = QPageRel.pageRel;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(pageRel.relParentType.eq(MspConstants.ITEM_COMPONENT));
        builder.and(pageRel.relParentSeq.eq(component.getComponentSeq()));
        builder.and(pageRel.relType.eq(MspConstants.ITEM_TEMPLATE));

        queryFactory.update(pageRel).where(builder)
                .set(pageRel.relSeq, component.getTemplate().getTemplateSeq()).execute();
    }

    @Override
    @Transactional
    public void updateRelDatasets(Component newComponent, Component orgComponent) {
        QPageRel pageRel = QPageRel.pageRel;

        if (!newComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
            // datasetSeq가 변경된 경우: update
            if (!orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(pageRel.relParentType.eq(MspConstants.ITEM_COMPONENT));
                builder.and(pageRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(pageRel.relType.eq(MspConstants.ITEM_DATASET));

                queryFactory.update(pageRel).where(builder)
                        .set(pageRel.relSeq, newComponent.getDataset().getDatasetSeq()).execute();
            } else {
                // datasetSeq가 추가된 경우: select -> insert
                // ContainerServiceImpl에서 처리
            }

        } else {
            // datasetSeq가 있다가 삭제된 경우: delete
            if (!orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(pageRel.relParentType.eq(MspConstants.ITEM_COMPONENT));
                builder.and(pageRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(pageRel.relType.eq(MspConstants.ITEM_DATASET));

                queryFactory.delete(pageRel).where(builder).execute();
            }
        }
    }

    @Override
    public List<PageRel> findList(String relType, Long relSeq) {
        QPageRel pageRel = QPageRel.pageRel;
        QPage page = QPage.page;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(pageRel.relType.eq(relType));
        builder.and(pageRel.relSeq.eq(relSeq));

        JPQLQuery<PageRel> query = queryFactory
                .select(Projections.fields(PageRel.class, page.as("page"), domain.as("domain"),
                        pageRel.relType.as("relType"), pageRel.relSeq.as("relSeq"),
                        // containerRel.relParentType.as("relParentType"),
                        // containerRel.relParentSeq.as("relParentSeq"),
                        pageRel.relOrder.as("relOrder")))
                .distinct().from(pageRel).where(builder).join(domain)
                .on(pageRel.domain.domainId.eq(domain.domainId)).fetchJoin().join(page)
                .on(pageRel.page.pageSeq.eq(page.pageSeq)).fetchJoin();
        return query.fetch();
    }
}
