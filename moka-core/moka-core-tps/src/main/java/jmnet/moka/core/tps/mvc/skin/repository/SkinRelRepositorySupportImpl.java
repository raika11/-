package jmnet.moka.core.tps.mvc.skin.repository;

import java.util.List;

import jmnet.moka.core.common.MokaConstants;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.skin.entity.QSkin;
import jmnet.moka.core.tps.mvc.skin.entity.QSkinRel;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.skin.entity.SkinRel;

public class SkinRelRepositorySupportImpl extends QuerydslRepositorySupport
        implements SkinRelRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public SkinRelRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(SkinRel.class);
        this.queryFactory = queryFactory;
    }

    @Override
    @Transactional
    public void updateRelTemplates(Component component) {
        QSkinRel skinRel = QSkinRel.skinRel;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(skinRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
        builder.and(skinRel.relParentSeq.eq(component.getComponentSeq()));
        builder.and(skinRel.relType.eq(MokaConstants.ITEM_TEMPLATE));

        queryFactory.update(skinRel).where(builder)
                .set(skinRel.relSeq, component.getTemplate().getTemplateSeq()).execute();
    }

    @Override
    @Transactional
    public void updateRelDatasets(Component newComponent, Component orgComponent) {
        QSkinRel skinRel = QSkinRel.skinRel;

        if (!newComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
            // datasetSeq가 변경된 경우: update
            if (!orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(skinRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
                builder.and(skinRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(skinRel.relType.eq(MokaConstants.ITEM_DATASET));

                queryFactory.update(skinRel).where(builder)
                        .set(skinRel.relSeq, newComponent.getDataset().getDatasetSeq()).execute();
            } else {
                // datasetSeq가 추가된 경우: select -> insert
                // ContainerServiceImpl에서 처리
            }

        } else {
            // datasetSeq가 있다가 삭제된 경우: delete
            if (!orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {
                BooleanBuilder builder = new BooleanBuilder();
                builder.and(skinRel.relParentType.eq(MokaConstants.ITEM_COMPONENT));
                builder.and(skinRel.relParentSeq.eq(newComponent.getComponentSeq()));
                builder.and(skinRel.relType.eq(MokaConstants.ITEM_DATASET));

                queryFactory.delete(skinRel).where(builder).execute();
            }
        }
    }

    @Override
    public List<SkinRel> findList(String relType, Long relSeq) {
        QSkinRel skinRel = QSkinRel.skinRel;
        QSkin skin = QSkin.skin;
        QDomain domain = QDomain.domain;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(skinRel.relType.eq(relType));
        builder.and(skinRel.relSeq.eq(relSeq));

        JPQLQuery<SkinRel> query = queryFactory
                .select(Projections.fields(SkinRel.class, skin.as("skin"), domain.as("domain"),
                        skinRel.relType.as("relType"), skinRel.relSeq.as("relSeq"),
                        // containerRel.relParentType.as("relParentType"),
                        // containerRel.relParentSeq.as("relParentSeq"),
                        skinRel.relOrd.as("relOrd")))
                .distinct().from(skinRel).where(builder).join(domain)
                .on(skinRel.domain.domainId.eq(domain.domainId)).fetchJoin().join(skin)
                .on(skinRel.skin.skinSeq.eq(skin.skinSeq)).fetchJoin();
        return query.fetch();
    }
}
