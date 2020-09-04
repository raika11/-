package jmnet.moka.core.tps.mvc.volume.repository;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.core.tps.mvc.volume.entity.QVolume;
import jmnet.moka.core.tps.mvc.volume.entity.Volume;

/**
 * <pre>
 * Volume Repository Support Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 1:34:41
 * @author jeon
 */
public class VolumeRepositorySupportImpl extends QuerydslRepositorySupport
        implements VolumeRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public VolumeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Volume.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Volume findLatestVolume() {
        QVolume volume = QVolume.volume;
        JPAQuery<Volume> query = queryFactory.selectFrom(volume);
        return query.orderBy(volume.createYmdt.desc()).limit(1L).fetchOne();
    }

}
