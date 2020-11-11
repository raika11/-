/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.service;

import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.repository.ReporterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 기자관리 서비스 2020. 11. 11. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 11. 오후 2:07:40
 */
@Service
@Slf4j
public class ReporterServiceImpl implements ReporterService {

    @Autowired
    private ReporterRepository reporterRepository;

    @Override
    public Page<Reporter> findAllReporterMgr(ReporterSearchDTO search, Pageable pageable) {
        return reporterRepository.findList(search, pageable);
    }

    @Override
    public Optional<Reporter> findReporterMgrById(Long repSeq) {
        return reporterRepository.findById(repSeq);
    }

    @Override
    public Reporter updateReporterMgr(Reporter reporter) {
        Reporter returnVal = reporterRepository.save(reporter);
        log.debug("[UPDATE DOMAIN] domainId : {}", returnVal.getRepSeq());
        return returnVal;
    }
}
