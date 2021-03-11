package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.repository.PushAppTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PushAppTokenServiceImpl implements PushAppTokenService{

    private final PushAppTokenRepository pushAppTokenRepository;
    private final ModelMapper modelMapper;

    public PushAppTokenServiceImpl(PushAppTokenRepository pushAppTokenRepository, ModelMapper modelMapper) {
        this.pushAppTokenRepository = pushAppTokenRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Optional<PushAppToken> findByAppSeq(Integer appSeq) {
        return pushAppTokenRepository.findFirstByAppSeqOrderByTokenSeqDesc(appSeq);
    }

    @Override
    public List<PushAppToken> findByTokenSeq(Long tokenSeq) {
        return pushAppTokenRepository.findByTokenSeq(tokenSeq);
    }

    //@Override
    //public List<PushAppToken> findAllToken(Integer appSeq, Integer pageIdx) {
    //    return pushAppTokenRepository.findAllByAppSeq(appSeq, PageRequest.of(1, pageIdx));
    //}

}
