package jmnet.moka.web.push.mvc.sender.service;

import java.util.Optional;
import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushContentSeqSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushContentUsedYnSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushRelContentIdSearchDTO;
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
    public Optional<PushContents> findByRelContentId(Long relContentId) {
        return pushContentsRepository.findByRelContentId(relContentId);
    }

    @Override
    public boolean isValidData(PushAppSearchDTO search) {
        Long relContentId = search.getRelContentId();
        return pushContentsRepository
                .findByRelContentId(relContentId)
                .isPresent();
    }

    @Override
    public PushContents savePushContents(PushContents pushContents) {
        return pushContentsRepository.save(pushContents);
    }

    @Override
    public Page<PushContents> findPushContentsList(PushRelContentIdSearchDTO search) {
        return pushContentsRepository.findByRelContentId(search.getRelContentId(), search.getPageable());
    }

    @Override
    public PushContents saveUsedYn(PushContents pushContents) {
        return pushContentsRepository.save(pushContents);
    }

    @Override
    public Page<PushContents> findPushContents(PushContentSeqSearchDTO search) {
        return pushContentsRepository.findByContentSeq(search.getContentSeq(), search.getPageable());
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
    public Page<PushContents> findAllByContentSeq(PushContentSeqSearchDTO search) {
        return pushContentsRepository.findAllByContentSeq(search.getContentSeq(), search.getPageable());
    }
}
