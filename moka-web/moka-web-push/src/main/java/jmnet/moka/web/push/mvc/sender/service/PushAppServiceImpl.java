package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import jmnet.moka.web.push.mvc.sender.repository.PushAppRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class PushAppServiceImpl implements PushAppService{

    @Autowired
    private PushAppRepository pushAppRepository;

    @Override
    public Optional<PushApp> isValidData(PushAppSearchDTO search) {
        Long appSeq = search.getAppSeq().longValue();
        return pushAppRepository.findAllByAppSeq(appSeq);
    }

    @Override
    public Optional<PushApp> findByAppSeq(Integer appSeq) {
        return pushAppRepository.findAllByAppSeq(appSeq.longValue());
    }
}
