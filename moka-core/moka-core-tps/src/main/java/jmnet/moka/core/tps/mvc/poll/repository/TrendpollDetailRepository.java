package jmnet.moka.core.tps.mvc.poll.repository;

import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.repository
 * ClassName : TrendpollDetailRepository
 * Created : 2021-01-13 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-13 10:29
 */
public interface TrendpollDetailRepository extends JpaRepository<TrendpollDetail, Long>, JpaSpecificationExecutor<TrendpollDetail> {

}
