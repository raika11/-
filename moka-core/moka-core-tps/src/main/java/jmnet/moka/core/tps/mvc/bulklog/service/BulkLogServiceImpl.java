package jmnet.moka.core.tps.mvc.bulklog.service;

import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalIdDTO;
import jmnet.moka.core.tps.mvc.bulklog.mapper.BulkLogMapper;
import jmnet.moka.core.tps.mvc.bulklog.repository.BulkLogRepository;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <pre>
 * 벌크 모니터링 로그 서비스
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.service
 * ClassName : BulkLogServiceImpl
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 14:11
 */
@Service
public class BulkLogServiceImpl implements BulkLogService {

    @Autowired
    private BulkLogRepository bulkLogRepository;

    @Autowired
    private BulkLogMapper bulkLogMapper;

    @Override
    public List<BulkTotalLogVO> findAllBulkLogStat(BulkLogTotalDTO searchDTO) {
        return bulkLogMapper.findAllTotal(searchDTO);
    }

    @Override
    public Page<BulkLogVO> findAllBulkLogStatList(BulkLogSearchDTO searchDTO) {
        List<BulkLogVO> list = bulkLogMapper.findAllList(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }

    @Override
    public Page<BulkLogVO> findAllBulkLogStatListByInfo(BulkLogTotalIdDTO searchDTO) {
        List<BulkLogVO> list = bulkLogMapper.findAllListInfo(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }

    @Override
    public Page<BulkLogVO> findAllBulkLogStatListByInfoMsg(BulkLogTotalIdDTO searchDTO) {
        List<BulkLogVO> list = bulkLogMapper.findAllListInfoMsg(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }
}
