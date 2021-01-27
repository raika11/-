package jmnet.moka.core.tps.mvc.search.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.search.dto.SearchKwdLogSearchDTO;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdLogVO;
import jmnet.moka.core.tps.mvc.search.vo.SearchKwdTotalLogVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.search.mapper
 * ClassName : SearchKwdLogMapper
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 13:19
 */
public interface SearchKwdLogMapper extends BaseMapper<SearchKwdLogVO, SearchKwdLogSearchDTO> {

    /**
     * 상세 통계
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<SearchKwdLogVO> findAllDetailStat(SearchKwdLogSearchDTO searchDTO);

    SearchKwdTotalLogVO findTotalStat(SearchKwdLogSearchDTO searchDTO);
}
