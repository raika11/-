/**
 * msp-tps DeskingRepositorySupportImpl.java 2020. 8. 11. 오전 10:43:25 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.entity.QDesking;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 8. 11. 오전 10:43:25
 */
public class DeskingRepositorySupportImpl extends QuerydslRepositorySupport implements DeskingRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Desking.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Desking> findByOtherCreator(Long datasetSeq, Date regDt, String regId) {
        QDesking desking = QDesking.desking;
        //        QDataset dataset = QDataset.dataset;

        BooleanBuilder builder = new BooleanBuilder();

        builder.and(desking.datasetSeq.eq(datasetSeq));
        builder.and(desking.regDt.gt(regDt));
        builder.and(desking.regId.ne(regId));

        JPQLQuery<Desking> query = queryFactory.selectFrom(desking)
                                               //                                               .innerJoin(desking.datasetSeq, dataset.datasetSeq)
                                               .fetchJoin()
                                               .where(builder)
                                               .orderBy(desking.regDt.desc());

        return query.fetch();
    }

    @Override
    public List<Desking> findByDatasetSeq(Long datasetSeq) {
        QDesking desking = QDesking.desking;

        BooleanBuilder builder = new BooleanBuilder();

        builder.and(desking.datasetSeq.eq(datasetSeq));
        builder.and(desking.parentContentId.isNull());

        JPQLQuery<Desking> query = queryFactory
                .selectFrom(desking)
                .where(builder)
                .orderBy(desking.contentOrd.asc());

        return query.fetch();
    }
}
