package jmnet.moka.web.schedule.mvc.gen.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatusHistory;
import jmnet.moka.web.schedule.mvc.gen.repository.GenContentRepository;
import jmnet.moka.web.schedule.mvc.gen.repository.GenStatusHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class GenContentServiceImpl implements GenContentService {

    @Autowired
    private GenContentRepository jobContentRepository;

    @Autowired
    private GenStatusHistoryRepository genStatusHistoryRepository;

    @Override
    public List<GenContent> findAllJobContent() {
        return jobContentRepository.findAllByUsedYn(MokaConstants.YES);
    }

    @Override
    public List<GenContent> findAllScheduleJobContent() {
        return jobContentRepository.findAllByUsedYnAndDelYnAndJobType(MokaConstants.YES, MokaConstants.NO, "S");
    }

    @Override
    public List<GenContent> findAllReservedJobContent() {
        return jobContentRepository.findAllByUsedYnAndDelYnAndJobType(MokaConstants.YES, MokaConstants.NO, "R");
    }

    @Override
    public Optional<GenContent> findJobContentBySeq(Long jobSeq) {
        return jobContentRepository.findById(jobSeq);
    }

    @Override
    public GenStatusHistory findGenStatusHistory(Long jobSeq) {
        return genStatusHistoryRepository.findFirstByJobSeqAndDelYnOrderBySeqNoDesc(jobSeq, "N");
    }

    @Override
    public Optional<GenStatusHistory> findGenStatusHistoryById(Long seqNo) {
        return genStatusHistoryRepository.findBySeqNoAndDelYnAndStatus(seqNo, "N", "0");
    }

    @Override
    public GenStatusHistory updateGenStatusHistory(GenStatusHistory genStatusHistory) {
        return genStatusHistoryRepository.save(genStatusHistory);
    }

    @Override
    public GenContent findJobContentByWorkType(String workType) {
        return jobContentRepository.findFirstByCategoryAndUsedYn(workType, MokaConstants.YES);
    }

}
