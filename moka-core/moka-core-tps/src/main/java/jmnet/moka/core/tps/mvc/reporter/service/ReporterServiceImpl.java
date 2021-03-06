/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.reporter.service;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.reporter.dto.ReporterSearchDTO;
import jmnet.moka.core.tps.mvc.reporter.entity.Reporter;
import jmnet.moka.core.tps.mvc.reporter.mapper.ReporterMapper;
import jmnet.moka.core.tps.mvc.reporter.repository.ReporterRepository;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterSaveVO;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<ReporterVO> findAllReporter(ReporterSearchDTO search) {
        return reporterMapper.findAll(search);
    }

    @Override
    public Optional<Reporter> findReporterById(String repSeq) {
        return reporterRepository.findById(repSeq);
    }

    @Override
    public ReporterVO findBySeq(String repSeq) {
        return reporterMapper.findBySeq(repSeq);
    }

    @Override
    public Reporter updateReporter(Reporter reporter) {
        Reporter returnVal = reporterRepository.save(reporter);
        log.debug("[UPDATE REP_SEQ] repSeq : {}", returnVal.getRepSeq());
        return returnVal;
    }

    @Override
    @Transactional
    public int insertReporters(ReporterSaveVO reporterSaveVO) {
        int repSeq = reporterMapper.insertReporters(reporterSaveVO);
        int rtn;

        if (repSeq == -1 && McpString.isEmpty(reporterSaveVO.getRepSeq())) {
            rtn = repSeq;
        } else {
            rtn = reporterSaveVO.getRepSeq();
        }
        return rtn;
    }

    @Override
    @Transactional
    public int updateReporters(ReporterSaveVO reporterSaveVO) {
        int repSeq = reporterMapper.updateReporters(reporterSaveVO);
        return repSeq;
    }
}
