package jmnet.moka.core.tps.mvc.schedule.server.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentHistorySearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContentHistory;
import jmnet.moka.core.tps.mvc.schedule.server.repository.JobContentHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class JobContentHistoryServiceImpl implements JobContentHistoryService {

    @Autowired
    private JobContentHistoryRepository jobContentHistoryRepository;


    @Override
    public Page<JobContentHistory> findJobContentHistoryList(JobContentHistorySearchDTO search) {
        return jobContentHistoryRepository.findJobContentHistoryList(search, search.getPageable());
    }

    @Override
    public Optional<JobContentHistory> findJobContentHistoryById(Long seqNo) {
        return jobContentHistoryRepository.findById(seqNo);
    }
}
