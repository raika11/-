package jmnet.moka.web.schedule.mvc.gen.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.repository.GenContentHistoryRepository;
import jmnet.moka.web.schedule.mvc.gen.repository.GenContentRepository;
import jmnet.moka.web.schedule.support.StatusFlagType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class GenContentServiceImpl implements GenContentService {

    @Autowired
    private GenContentRepository jobContentRepository;

    @Autowired
    private GenContentHistoryRepository genStatusHistoryRepository;

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
    public Optional<GenContentHistory> findGenContentHistory(Long jobSeq) {
        return genStatusHistoryRepository.findFirstByJobSeqAndDelYnOrderBySeqNoDesc(jobSeq, MokaConstants.NO);
    }

    @Override
    public Optional<GenContentHistory> findGenContentHistoryById(Long seqNo) {
        return genStatusHistoryRepository.findBySeqNoAndDelYnAndStatus(seqNo, MokaConstants.NO, StatusFlagType.READY);
    }

    @Override
    public Optional<GenContentHistory> findGenContentHistoryByJobTaskId(String jobTaskId) {
        return genStatusHistoryRepository.findByJobTaskIdAndDelYnAndStatus(jobTaskId, MokaConstants.NO, StatusFlagType.READY);
    }

    @Override
    public GenContentHistory insertGenContentHistory(GenContentHistory genStatusHistory) {
        return genStatusHistoryRepository.save(genStatusHistory);
    }

    @Override
    public long countGenContentHistoryByJobTaskId(String jobTaskId) {
        return genStatusHistoryRepository.countByJobTaskId(jobTaskId);
    }

    @Override
    public GenContentHistory updateGenContentHistory(GenContentHistory genStatusHistory) {
        return genStatusHistoryRepository.save(genStatusHistory);
    }

    @Override
    public Optional<GenContent> findJobContentByJobCd(String jobCd) {
        return jobContentRepository.findFirstByJobCdAndUsedYn(jobCd, MokaConstants.YES);
    }

}
