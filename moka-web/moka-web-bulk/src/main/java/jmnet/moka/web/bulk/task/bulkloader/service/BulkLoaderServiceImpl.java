package jmnet.moka.web.bulk.task.bulkloader.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.mapper.idb.BulkLoaderIdbMapper;
import jmnet.moka.web.bulk.mapper.moka.BulkLoaderMokaMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkloader.service
 * ClassName : BulkLoaderServiceImpl
 * Created : 2020-12-11 011 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-11 011 오후 2:54
 */
@Service
@Slf4j
public class BulkLoaderServiceImpl implements BulkLoaderService {
    private final BulkLoaderIdbMapper bulkLoaderIdbMapper;
    private final BulkLoaderMokaMapper bulkLoaderMokaMapper;

    public BulkLoaderServiceImpl(BulkLoaderIdbMapper bulkLoaderIdbMapper, BulkLoaderMokaMapper bulkLoaderMokaMapper) {
        this.bulkLoaderIdbMapper = bulkLoaderIdbMapper;
        this.bulkLoaderMokaMapper = bulkLoaderMokaMapper;
    }

    @Override
    public List<Map<String, Object>> getUspBulkMgtListSel() {
        return this.bulkLoaderMokaMapper.callUspBulkMgtListSel();
    }

    @Override
    @Transactional
    public void insertBulkLoaderData(TotalVo<Map<String, Object>> totalVo) {
        this.bulkLoaderIdbMapper.callUspBulkNewsTableIns(totalVo);
        this.bulkLoaderMokaMapper.callUspBulkMgtDel(totalVo.getMainData());
    }

    @Override
    public void insertBulkLog(TotalVo<Map<String, Object>> totalVo, int status, String message, boolean isError) {
        totalVo.getMainData().replace("loadStatus", status );
        if( isError )
            totalVo.logError(message);
        else
            totalVo.logInfo(message);
        totalVo.setMsg(totalVo.getInfoMessageList());

        this.bulkLoaderIdbMapper.callUspBulkLogInsByLoader(totalVo);

        totalVo.setInfoMessageFlush();
    }

    @Override
    public void insertBulkLog(TotalVo<Map<String, Object>> totalVo, int status, String message) {
        insertBulkLog( totalVo, status, message, false);
    }
}
