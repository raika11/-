package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenHist;
import jmnet.moka.web.push.mvc.sender.repository.PushAppTokenHistRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushAppTokenHistServiceImpl implements PushAppTokenHistService{

    private final PushAppTokenHistRepository pushAppTokenHistRepository;
    private final ModelMapper modelMapper;

    public PushAppTokenHistServiceImpl(PushAppTokenHistRepository pushAppTokenHistRepository, ModelMapper modelMapper) {
        this.pushAppTokenHistRepository = pushAppTokenHistRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public PushAppTokenHist savePushAppTokenHist(PushAppTokenHist pushAppTokenHist) {
        return pushAppTokenHistRepository.save(pushAppTokenHist);
    }
}
