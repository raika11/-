package jmnet.moka.core.tps.mvc.schedule.server.service;

import java.util.List;

import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobStatisticSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobStatistic;
import jmnet.moka.core.tps.mvc.schedule.server.mapper.JobStatisticMapper;
import jmnet.moka.core.tps.mvc.schedule.server.repository.JobStatisticRepository;
import jmnet.moka.core.tps.mvc.schedule.server.vo.JobStatisticVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;


@Service
public class JobStatisticServiceImpl implements JobStatisticService{

    @Autowired
    private JobStatisticMapper jobStatisticMapper;

    @Autowired
    private JobStatisticRepository jobStatisticRepository;

    private final EntityManager entityManager;

    public JobStatisticServiceImpl(@Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Page<JobStatisticVO> findAllJobStat(JobStatisticSearchDTO searchDTO) {
        List<JobStatisticVO> list = jobStatisticMapper.findAll(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }

    @Override
    public Page<JobStatistic> findJobStatisticList(JobStatisticSearchDTO search) {
        return jobStatisticRepository.findJobStatisticList(search, search.getPageable());
    }
}
