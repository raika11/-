package jmnet.moka.web.push.mvc.sender.service;

import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushRelContentIdSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.repository.PushContentsProcRepository;
import jmnet.moka.web.push.mvc.sender.repository.PushContentsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushContentsServiceImpl implements PushContentsService{

    @Autowired
    private PushContentsRepository pushContentsRepository;
    @Autowired
    private PushContentsProcRepository pushContentsProcRepository;

    @Override
    public boolean isValidData(PushAppSearchDTO search) {
        Long relContentId = search.getRelContentId();
        return pushContentsRepository.findByRelContentId(relContentId).isPresent();
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
    public PushContentsProc savePushContentsProc(PushContentsProc pushContentsProc) {
        return pushContentsProcRepository.save(pushContentsProc);
    }
}
