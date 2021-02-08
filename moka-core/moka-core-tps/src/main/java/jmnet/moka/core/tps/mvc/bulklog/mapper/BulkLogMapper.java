package jmnet.moka.core.tps.mvc.bulklog.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;

import java.util.List;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.mapper
 * ClassName : BulkLogMapper
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 13:19
 */
public interface BulkLogMapper extends BaseMapper<BulkTotalLogVO, BulkLogSearchDTO> {

    /**
     * 상세 통계
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<BulkTotalLogVO> findAllTotal(BulkLogSearchDTO searchDTO);

    /**
     * 상세 통계
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<BulkLogVO> findAllList(BulkLogSearchDTO searchDTO);
}
