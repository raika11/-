package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.repository.PushAppRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushAppServiceImpl implements PushAppService {

    @Autowired
    private PushAppRepository pushAppRepository;

    @Override
    public boolean isValidData(PushAppSearchDTO search) {
        //log.info(Integer.parseInt(search.getAppSeq()));

        Integer appSeq = search.getAppSeq();
        return pushAppRepository
                .findByAppSeq(appSeq)
                .isPresent();
    }
}
