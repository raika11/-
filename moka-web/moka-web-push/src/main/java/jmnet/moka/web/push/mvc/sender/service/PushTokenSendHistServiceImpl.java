package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenHist;
import jmnet.moka.web.push.mvc.sender.entity.PushTokenSendHist;
import jmnet.moka.web.push.mvc.sender.repository.PushAppTokenHistRepository;
import jmnet.moka.web.push.mvc.sender.repository.PushTokenSendHistRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushTokenSendHistServiceImpl implements PushTokenSendHistService{

    private final PushTokenSendHistRepository pushTokenSendHistRepository;
    private final ModelMapper modelMapper;

    public PushTokenSendHistServiceImpl(PushTokenSendHistRepository pushTokenSendHistRepository, ModelMapper modelMapper) {
        this.pushTokenSendHistRepository = pushTokenSendHistRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public PushTokenSendHist savePushTokenSendHist(PushTokenSendHist pushTokenSendHist) {
        return pushTokenSendHistRepository.save(pushTokenSendHist);
    }
}
