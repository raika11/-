package jmnet.moka.web.rcv.task.calljamapi.service;

import java.util.List;
import java.util.Map;
import jmnet.moka.web.rcv.mapper.moka.CallJamApiMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.calljamapi.service
 * ClassName : CallJamApiServiceImpl
 * Created : 2020-12-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-09 009 오후 1:08
 */
@Service
@Slf4j
public class CallJamApiServiceImpl implements CallJamApiService {
    private final CallJamApiMapper callJamApiMapper;

    public CallJamApiServiceImpl(CallJamApiMapper callJamApiMapper) {
        this.callJamApiMapper = callJamApiMapper;
    }

    @Override
    public List<Map<String, Object>> getUpaJamRcvArtHistSelList() {
        return this.callJamApiMapper.callUpaJamRcvArtHistListSel();
    }

    @Override
    public void insertReceiveJobStep(List<Map<String, Object>> mapList) {
        for( Map<String, Object> map : mapList ){
            callJamApiMapper.callUpaCpRcvArtHistUpd( map );
        }
    }

    @Override
    public void deleteReceiveJobStep() {
        callJamApiMapper.callUpaCpRcvArtHistDel();
    }
}
