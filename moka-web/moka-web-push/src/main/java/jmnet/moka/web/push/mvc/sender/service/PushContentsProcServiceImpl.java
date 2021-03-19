package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.repository.PushContentsProcRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushContentsProcServiceImpl implements PushContentsProcService {

    private final PushContentsProcRepository pushContentsProcRepository;
    private final ModelMapper modelMapper;

    public PushContentsProcServiceImpl(PushContentsProcRepository pushContentsProcRepository, ModelMapper modelMapper) {
        this.pushContentsProcRepository = pushContentsProcRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public PushContentsProc savePushContentsProc(PushContentsProc pushContentsProc) {
        return pushContentsProcRepository.save(pushContentsProc);
    }
}
