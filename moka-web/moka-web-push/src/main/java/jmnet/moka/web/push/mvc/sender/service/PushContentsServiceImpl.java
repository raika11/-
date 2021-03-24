package jmnet.moka.web.push.mvc.sender.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.web.push.mvc.sender.dto.PushContentUsedYnSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.repository.PushContentsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushContentsServiceImpl implements PushContentsService {

    @Autowired
    private PushContentsRepository pushContentsRepository;

    @Override
    public List<PushContents> findByRelContentId(Long relContentId) {
        return pushContentsRepository.findByRelContentId(relContentId);
    }

    @Override
    public PushContents savePushContents(PushContents pushContents) {
        return pushContentsRepository.save(pushContents);
    }

    @Override
    public PushContents saveUsedYn(PushContents pushContents) {
        return pushContentsRepository.save(pushContents);
    }

    @Override
    public Optional<PushContents> findPushContentsBySeq(Long contentSeq) {
        return pushContentsRepository.findByContentSeq(contentSeq);
    }

    @Override
    public Page<PushContents> findAllByUsedYn(PushContentUsedYnSearchDTO search) {
        return pushContentsRepository.findAllByUsedYn(search.getUsedYn(), search.getPageable());
    }

    @Override
    public Long countByContentSeqAndPushYn(Long contentSeq, String pushYn) {
        return pushContentsRepository.countByContentSeqAndPushYn(contentSeq, pushYn);
    }
}
