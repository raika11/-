package jmnet.moka.core.tps.mvc.bulklog.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalIdDTO;
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
     * 벌크 모니터링 통계 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<BulkTotalLogVO> findAllTotal(BulkLogTotalDTO searchDTO);

    /**
     * 벌크 전송 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<BulkLogVO> findAllList(BulkLogSearchDTO searchDTO);

    /**
     * 벌크 전송 상세정보/메세지 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<BulkLogVO> findAllListInfo(BulkLogTotalIdDTO searchDTO);
    /**
     * 벌크 전송 목록 메세지 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<BulkLogVO> findAllListInfoMsg(BulkLogTotalIdDTO searchDTO);
}
