/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.service;
import jmnet.moka.core.tps.mvc.reporter.Mapper.ReporterMapper;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.repository.ReporterRepository;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
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

    @Autowired
    private ReporterMapper reporterMapper;


    @Override
    public List<ReporterVO> findAllReporterMgr(ReporterSearchDTO search) {
        return reporterMapper.findAll(search);
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
