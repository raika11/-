package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushTokenSendHist;
import jmnet.moka.web.push.mvc.sender.mapper.PushTokenSendHistMapper;
import jmnet.moka.web.push.mvc.sender.repository.PushTokenSendHistRepository;
import jmnet.moka.web.push.mvc.sender.vo.PushTokenBatchVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushTokenSendHistServiceImpl implements PushTokenSendHistService {

    private final PushTokenSendHistRepository pushTokenSendHistRepository;
    private final ModelMapper modelMapper;
    private final PushTokenSendHistMapper pushTokenSendHistMapper;

    public PushTokenSendHistServiceImpl(PushTokenSendHistRepository pushTokenSendHistRepository, ModelMapper modelMapper,
            PushTokenSendHistMapper pushTokenSendHistMapper) {
        this.pushTokenSendHistRepository = pushTokenSendHistRepository;
        this.modelMapper = modelMapper;
        this.pushTokenSendHistMapper = pushTokenSendHistMapper;
    }

    @Override
    public PushTokenSendHist savePushTokenSendHist(PushTokenSendHist pushTokenSendHist) {
        return pushTokenSendHistRepository.save(pushTokenSendHist);
    }

    @Override
    public int insertPushTokenSendHistBatch(PushTokenBatchVO pushTokenBatch) {
        return pushTokenSendHistMapper.insertPushTokenSendHist(pushTokenBatch);
    }

    @Override
    public int updatePushTokenSendHistBatch(PushTokenBatchVO pushTokenBatch) {
        return pushTokenSendHistMapper.updatePushTokenSendHist(pushTokenBatch);
    }
}
