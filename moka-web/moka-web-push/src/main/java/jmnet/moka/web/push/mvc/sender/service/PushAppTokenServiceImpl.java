package jmnet.moka.web.push.mvc.sender.service;

import java.util.List;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
import jmnet.moka.web.push.mvc.sender.mapper.PushTokenMapper;
import jmnet.moka.web.push.mvc.sender.repository.PushAppTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushAppTokenServiceImpl implements PushAppTokenService {

    private final PushAppTokenRepository pushAppTokenRepository;
    private final ModelMapper modelMapper;
    private final PushTokenMapper pushTokenMapper;

    public PushAppTokenServiceImpl(PushAppTokenRepository pushAppTokenRepository, ModelMapper modelMapper, PushTokenMapper pushTokenMapper) {
        this.pushAppTokenRepository = pushAppTokenRepository;
        this.modelMapper = modelMapper;
        this.pushTokenMapper = pushTokenMapper;
    }

    @Override
    public List<PushAppToken> findPushAppToken(PushAppTokenSearchDTO pushAppTokenSearch) {
        return pushAppTokenRepository.findAllByAppScope(pushAppTokenSearch);
    }

    @Override
    public PushAppTokenStatus findPushAppTokenStatus(Integer appSeq) {
        return pushAppTokenRepository.countAllByAppScope(appSeq);
    }

    @Override
    public void deletePushAppToken(String pushTokenSeqs) {
        pushTokenMapper.deletePushTokens(pushTokenSeqs);
    }

}
