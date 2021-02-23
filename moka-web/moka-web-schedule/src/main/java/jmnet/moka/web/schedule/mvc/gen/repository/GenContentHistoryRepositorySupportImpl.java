package jmnet.moka.web.schedule.mvc.gen.repository;

import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.entity.QGenContentHistory;
import jmnet.moka.web.schedule.support.StatusFlagType;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.gen.repository
 * ClassName : GenContentHistoryRepositorySupportImpl
 * Created : 2021-02-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-23 13:13
 */
public class GenContentHistoryRepositorySupportImpl extends QuerydslRepositorySupport implements GenContentHistoryRepositorySupport {
    /**
     * Creates a new {@link QuerydslRepositorySupport} instance for the given domain type.
     */
    public GenContentHistoryRepositorySupportImpl() {
        super(GenContentHistory.class);
    }


    @Override
    public long countByJobTaskId(String jobTaskId) {

        QGenContentHistory genContentHistory = QGenContentHistory.genContentHistory;


        JPQLQuery<GenContentHistory> query = from(genContentHistory);

        query.where(genContentHistory.jobTaskId
                .eq(jobTaskId)
                .and(genContentHistory.delYn.eq(MokaConstants.NO))
                .and(genContentHistory.status.in(StatusFlagType.READY, StatusFlagType.PROCESSING))
                .and(genContentHistory.reserveDt.after(McpDate.now())));

        return query.fetchCount();
    }
}
