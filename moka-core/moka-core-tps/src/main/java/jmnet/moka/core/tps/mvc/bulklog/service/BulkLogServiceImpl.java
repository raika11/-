package jmnet.moka.core.tps.mvc.bulklog.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogSearchDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalDTO;
import jmnet.moka.core.tps.mvc.bulklog.dto.BulkLogTotalIdDTO;
import jmnet.moka.core.tps.mvc.bulklog.mapper.BulkLogMapper;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkLogVO;
import jmnet.moka.core.tps.mvc.bulklog.vo.BulkTotalLogVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

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
    private BulkLogMapper bulkLogMapper;

    @Override
    public List<BulkTotalLogVO> findAllBulkLogStat(BulkLogTotalDTO searchDTO) {
        return bulkLogMapper.findAllTotal(searchDTO);
    }

    @Override
    public Page<BulkLogVO> findAllBulkLogStatList(BulkLogSearchDTO searchDTO) {
        String chkSorceCode = searchDTO.getOrgSourceCode();
        String chkPortalDiv = searchDTO.getPortalDiv();

        if (chkPortalDiv == null || searchDTO
                .getPortalDiv()
                .isEmpty()) {
            searchDTO.setPortalDiv(" ");
        }
        if (chkSorceCode == null || searchDTO
                .getOrgSourceCode()
                .isEmpty()) {
            searchDTO.setOrgSourceCode("");
        } else {
            if (chkSorceCode.equals("all")) {
                searchDTO.setOrgSourceCode("");
            }
        }
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
