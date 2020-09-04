package jmnet.moka.core.tps.mvc.desking.repository;

import jmnet.moka.core.tps.mvc.desking.entity.QDeskingWork;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingRelWork;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.desking.entity.QDeskingRelWork;

public class DeskingRelWorkRepositorySupportImpl extends QuerydslRepositorySupport
        implements DeskingRelWorkRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DeskingRelWorkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DeskingRelWork.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public void deleteByContentsIdAndrelContentsId(DeskingRelWork deskingRelWork) {
        QDeskingRelWork deskingRelWorkT = QDeskingRelWork.deskingRelWork;
        BooleanBuilder builder = new BooleanBuilder();

        builder.and(deskingRelWorkT.deskingSeq.eq(deskingRelWork.getDeskingSeq()));
        builder.and(deskingRelWorkT.creator.eq(deskingRelWork.getCreator()));
        builder.and(deskingRelWorkT.contentsId.eq(deskingRelWork.getContentsId()));
        builder.and(deskingRelWorkT.relContentsId.eq(deskingRelWork.getRelContentsId()));

        // 삭제
        queryFactory.delete(deskingRelWorkT).where(builder).execute();
    }
}
