package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.repository.PushAppTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Page<PushAppToken> findPushAppToken(Integer appSeq, Pageable pageable) {
        return pushAppTokenRepository.findAllByAppSeq(appSeq, pageable);
    }

    @Override
    public List<PushAppToken> findByAppSeqAsc(Integer appSeq) {
        return pushAppTokenRepository.findFirstByAppSeqOrderByTokenSeqAsc(appSeq);
    }

    @Override
    public List<PushAppToken> findByAppSeqDesc(Integer appSeq) {
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

    @Override
    public void deletePushAppToken(List<PushAppToken> pushTokens) {
        for (PushAppToken pushToken : pushTokens) {
            long tokenSeq = pushToken.getTokenSeq();
            System.out.println("tokenSeq="+tokenSeq);

            //pushAppTokenRepository.deleteById(tokenSeq.intValue());
        }
    }

}
