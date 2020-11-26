package jmnet.moka.core.tps.mvc.desking.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.entity.QDeskingWork;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 8. 11. 오전 10:43:25
 */
public class DeskingWorkRepositorySupportImpl extends QuerydslRepositorySupport implements DeskingWorkRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingWorkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DeskingWork.class);
        this.queryFactory = queryFactory;
    }

    @Override
    @Transactional
    public void deleteByDatasetSeq(Long datasetSeq, String regId) {
        QDeskingWork deskingWork = QDeskingWork.deskingWork;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(deskingWork.datasetSeq.eq(datasetSeq));
        builder.and(deskingWork.regId.eq(regId));

        // 삭제
        queryFactory.delete(deskingWork)
                    .where(builder)
                    .execute();
    }

    @Override
    public List<DeskingWork> findAllDeskingWork(DeskingWorkSearchDTO search) {
        QDeskingWork deskingWork = QDeskingWork.deskingWork;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(deskingWork.datasetSeq.eq(search.getDatasetSeq()));
        builder.and(deskingWork.regId.eq(search.getRegId()));

        JPQLQuery<DeskingWork> query = queryFactory.selectFrom(deskingWork)
                                                   .where(builder)
                                                   .orderBy(deskingWork.contentOrd.asc(), deskingWork.relOrd.asc(), deskingWork.parentContentId.asc(),
                                                            deskingWork.seq.desc());

        return query.fetch();
    }
}
