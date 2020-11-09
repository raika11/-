/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.service;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.repository.ReporterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 도메인 서비스 2020. 1. 8. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 1. 8. 오후 2:07:40
 */
@Service
@Slf4j
public class ReporterServiceImpl implements ReporterService {

    @Autowired
    private ReporterRepository reporterRepository;

    @Override
    public Page<Reporter> findAllReporterMgr(SearchDTO search) {
        return reporterRepository.findAll(search.getPageable());
    }

    @Override
    public List<Reporter> findAllReporterMgr() {
        return reporterRepository.findAll();
    }

    @Override
    public Optional<Reporter> findReporterMgrById(String repSeq) {
        return reporterRepository.findById(repSeq);
    }

    @Override
    public Reporter updateReporterMgr(Reporter reporter) {
        Reporter returnVal = reporterRepository.save(reporter);
        log.debug("[UPDATE DOMAIN] domainId : {}", returnVal.getRepSeq());
        return returnVal;
    }
}
