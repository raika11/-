package jmnet.moka.core.tps.mvc.desking.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.desking.entity.QDeskingWork;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 * 
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 8. 11. 오전 10:43:25
 * @author ssc
 */
public class DeskingWorkRepositorySupportImpl extends QuerydslRepositorySupport
        implements DeskingWorkRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingWorkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DeskingWork.class);
        this.queryFactory = queryFactory;
    }

    @Override
    @Transactional
    public void deleteByDatasetSeq(Long datasetSeq, String creator) {
        QDeskingWork deskingWork = QDeskingWork.deskingWork;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(deskingWork.datasetSeq.eq(datasetSeq));
        builder.and(deskingWork.creator.eq(creator));

        // 삭제
        queryFactory.delete(deskingWork).where(builder).execute();
    }
}
