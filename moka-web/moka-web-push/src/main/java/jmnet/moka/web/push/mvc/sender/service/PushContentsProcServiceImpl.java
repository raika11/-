package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProcPK;
import jmnet.moka.web.push.mvc.sender.repository.PushContentsProcRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PushContentsProcServiceImpl implements PushContentsProcService{

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

    @Override
    public Optional<PushContentsProc> findPushContentsProcById(PushContentsProcPK pushContentsProcPK) {

        System.out.println("=====================================================");
        System.out.println("ContentSeq  ="+pushContentsProcPK.getContentSeq());
        System.out.println("AppSeq      ="+pushContentsProcPK.getAppSeq());

        return pushContentsProcRepository.findById(pushContentsProcPK);
    }
}
