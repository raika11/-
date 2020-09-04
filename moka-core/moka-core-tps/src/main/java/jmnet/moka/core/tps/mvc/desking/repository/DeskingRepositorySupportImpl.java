/**
 * msp-tps DeskingRepositorySupportImpl.java 2020. 8. 11. 오전 10:43:25 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

import java.util.List;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.dataset.entity.QDataset;
import jmnet.moka.core.tps.mvc.desking.entity.QDesking;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;

/**
 * <pre>
 * 
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 8. 11. 오전 10:43:25
 * @author ssc
 */
public class DeskingRepositorySupportImpl extends QuerydslRepositorySupport
        implements DeskingRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Desking.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Desking> findByOtherCreator(Long datasetSeq, String createYmdt, String creator) {
        QDesking desking = QDesking.desking;
        QDataset dataset = QDataset.dataset;

        BooleanBuilder builder = new BooleanBuilder();

        builder.and(desking.dataset.datasetSeq.eq(datasetSeq));
        builder.and(desking.createYmdt.gt(createYmdt));
        builder.and(desking.creator.ne(creator));

        JPQLQuery<Desking> query =
                queryFactory.selectFrom(desking).innerJoin(desking.dataset, dataset).fetchJoin()
                        .where(builder).orderBy(desking.createYmdt.desc());

        return query.fetch();
    }
}
