package jmnet.moka.core.tps.mvc.container.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.container.entity.ContainerRel;
import jmnet.moka.core.tps.mvc.container.entity.QContainer;
import jmnet.moka.core.tps.mvc.container.entity.QContainerRel;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import org.springframework.transaction.annotation.Transactional;

public class ContainerRelRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ContainerRelRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ContainerRelRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ContainerRel.class);
        this.queryFactory = queryFactory;
    }

    @Override
    @Transactional
    public void updateRelTemplates(Component component) {
        QContainerRel containerRel = QContainerRel.containerRel;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(containerRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
        builder.and(containerRel.relParentSeq.eq(component.getComponentSeq()));
        builder.and(containerRel.relType.eq(MokaConstants.ITEM_TEMPLATE));

        queryFactory
                .update(containerRel)
                .where(builder)
                .set(containerRel.relSeq, component
                        .getTemplate()
                        .getTemplateSeq())
                .execute();
    }

    @Override
    @Transactional
    public void updateRelDatasets(Component newComponent, Component orgComponent) {
        QContainerRel containerRel = QContainerRel.containerRel;

        if (!newComponent
                .getDataType()
                .equals(TpsConstants.DATATYPE_NONE)) {
            // datasetSeq가 변경된 경우: update
            if (!orgComponent
                    .getDataType()
                    .equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(containerRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
                builder.and(containerRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(containerRel.relType.eq(MokaConstants.ITEM_DATASET));

                queryFactory
                        .update(containerRel)
                        .where(builder)
                        .set(containerRel.relSeq, newComponent
                                .getDataset()
                                .getDatasetSeq())
                        .execute();
            } else {
                // datasetSeq가 추가된 경우: select -> insert
                // ContainerServiceImpl에서 처리
            }

        } else {
            // datasetSeq가 있다가 삭제된 경우: delete
            if (!orgComponent
                    .getDataType()
                    .equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(containerRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
                builder.and(containerRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(containerRel.relType.eq(MokaConstants.ITEM_DATASET));

                queryFactory
                        .delete(containerRel)
                        .where(builder)
                        .execute();
            }
        }
    }

    @Override
    public List<ContainerRel> findList(String relType, Long relSeq) {
        QContainerRel containerRel = QContainerRel.containerRel;
        QContainer container = QContainer.container;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(containerRel.relType.eq(relType));
        builder.and(containerRel.relSeq.eq(relSeq));

        JPQLQuery<ContainerRel> query = queryFactory
                .select(Projections.fields(ContainerRel.class, container.as("container"), domain.as("domain"), containerRel.relType.as("relType"),
                        containerRel.relSeq.as("relSeq"),
                        // containerRel.relParentType.as("relParentType"),
                        // containerRel.relParentSeq.as("relParentSeq"),
                        containerRel.relOrd.as("relOrd")))
                .distinct()
                .from(containerRel)
                .where(builder)
                .join(domain)
                .on(containerRel.domain.domainId.eq(domain.domainId))
                .fetchJoin()
                .join(container)
                .on(containerRel.container.containerSeq.eq(container.containerSeq))
                .fetchJoin();
        return query.fetch();
    }

}
