package jmnet.moka.core.tps.mvc.poll.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.repository
 * ClassName : TrendpollRepositorySupport
 * Created : 2021-01-13 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-13 11:28
 */
public interface TrendpollRepositorySupport {

    Page<Trendpoll> findAllTrendpoll(TrendpollSearchDTO searchDTO);

    long updateTrendpollStatus(Long pollSeq, PollStatusCode status);

    long deleteItemByPollSeq(Long pollSeq, List<Long> exceptSeqs);

    long deleteContentsByPollSeq(Long pollSeq, List<Long> exceptSeqs);
}
