package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.mapper.PushTokenMapper;
import jmnet.moka.web.push.mvc.sender.repository.PushTokenSendHistRepository;
import jmnet.moka.web.push.mvc.sender.vo.PushTokenBatchVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class PushTokenSendHistServiceImpl implements PushTokenSendHistService {

    private final PushTokenSendHistRepository pushTokenSendHistRepository;
    private final ModelMapper modelMapper;
    private final PushTokenMapper pushTokenMapper;

    public PushTokenSendHistServiceImpl(PushTokenSendHistRepository pushTokenSendHistRepository, ModelMapper modelMapper,
            PushTokenMapper pushTokenMapper) {
        this.pushTokenSendHistRepository = pushTokenSendHistRepository;
        this.modelMapper = modelMapper;
        this.pushTokenMapper = pushTokenMapper;
    }

    @Override
    @Transactional
    public int insertPushTokenSendHistBatch(PushTokenBatchVO pushTokenBatch) {
        return pushTokenMapper.insertPushTokenSendHist(pushTokenBatch);
    }

    @Override
    @Transactional
    public int updatePushTokenSendHistBatch(PushTokenBatchVO pushTokenBatch) {
        return pushTokenMapper.updatePushTokenSendHist(pushTokenBatch);
    }
}
