package jmnet.moka.web.schedule.mvc.gen.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.repository.GenContentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class GenContentServiceImpl implements GenContentService {

    @Autowired
    private GenContentRepository jobContentRepository;

    @Override
    public List<GenContent> findAllJobContent() {
        return jobContentRepository.findAllByUsedYn(MokaConstants.YES);
    }

    @Override
    public Optional<GenContent> findJobContentBySeq(Long jobSeq) {
        return jobContentRepository.findById(jobSeq);
    }

    @Override
    public GenContent findJobContentByWorkType(String workType) {
        return jobContentRepository.findFirstByCategoryAndUsedYn(workType, MokaConstants.YES);
    }

}
