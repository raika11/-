package jmnet.moka.core.tps.mvc.search.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.search.dto.SearchKwdLogSearchDTO;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdLogVO;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdTotalLogVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.search.service
 * ClassName : SearchKwdLogService
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 14:02
 */
public interface SearchKwdLogService {

    SearchKwdTotalLogVO findSearchKwdLogTotalStat(SearchKwdLogSearchDTO searchDTO);

    Page<SearchKwdLogVO> findAllSearchKwdLogStat(SearchKwdLogSearchDTO searchDTO);

    List<SearchKwdLogVO> findAllSearchKwdLogDetailStat(SearchKwdLogSearchDTO searchDTO);
}
