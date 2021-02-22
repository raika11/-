package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.repository.PushAppDeleteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushAppDeleteServiceImpl implements PushAppDeleteService{

    @Autowired
    private PushAppDeleteRepository pushAppDeleteRepository;

    @Override
    public Long countByContentSeq(Long contentSeq) {
        return pushAppDeleteRepository.countByContentSeq(contentSeq);
    }
}
