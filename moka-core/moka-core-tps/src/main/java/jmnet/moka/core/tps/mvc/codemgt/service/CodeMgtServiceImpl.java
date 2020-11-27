package jmnet.moka.core.tps.mvc.codemgt.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;

import com.querydsl.core.QueryResults;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDtlDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import jmnet.moka.core.tps.mvc.codemgt.repository.CodeMgtGrpRepository;
import jmnet.moka.core.tps.mvc.codemgt.repository.CodeMgtRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 * 기타코드 Service Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 6:17:33
 */
@Service
@Slf4j
public class CodeMgtServiceImpl implements CodeMgtService {

    @Autowired
    private CodeMgtRepository codeMgtRepository;

    @Autowired
    private CodeMgtGrpRepository codeMgtGrpRepository;

    private final EntityManager entityManager;

    @Autowired
    public CodeMgtServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<CodeMgt> findUseList(String grpCd) {
        return codeMgtRepository.findUseList(grpCd);
    }

    @Override
    public Page<CodeMgt> findList(CodeMgtSearchDTO search, Pageable pageable) {
        return codeMgtRepository.findList(search, pageable);
    }

    @Override
    public Page<CodeMgtGrp> findGrpList(Pageable pageable) {
        return codeMgtGrpRepository.findAll(pageable);
    }

    @Override
    public Optional<CodeMgtGrp> findByGrpSeqNo(Long seqNo) {
        return codeMgtGrpRepository.findById(seqNo);
    }

    @Override
    public CodeMgtGrp insertCodeMgtGrp(CodeMgtGrp codeMgtGrp) {
        return codeMgtGrpRepository.save(codeMgtGrp);
    }

    @Override
    public CodeMgtGrp updateCodeMgtGrp(CodeMgtGrp codeMgtGrp) {
        return codeMgtGrpRepository.save(codeMgtGrp);
    }

    @Override
    public void deleteCodeMgtGrp(CodeMgtGrp codeMgtGrp) {
        log.info("[DELETE codeMgtGrp] seqNo : {}", codeMgtGrp.getSeqNo());

        codeMgtGrpRepository.deleteById(codeMgtGrp.getSeqNo());
    }

    @Override
    public Long countCodeMgtByGrpCd(String grpCd) {
        return codeMgtRepository.countByCodeMgtGrp_GrpCd(grpCd);
    }

    @Override
    public Optional<CodeMgt> findBySeqNo(Long seqNo) {
        return codeMgtRepository.findById(seqNo);
    }

    @Override
    @Transactional
    public CodeMgt insertCodeMgt(CodeMgt codeMgt) {
        CodeMgt returnCodeMgt = codeMgtRepository.save(codeMgt);
        entityManager.refresh(returnCodeMgt);
        return returnCodeMgt;
    }

    @Override
    public CodeMgt updateCodeMgt(CodeMgt codeMgt) {
        return codeMgtRepository.save(codeMgt);
    }

    @Override
    public void deleteCodeMgt(CodeMgt codeMgt) {
        log.info("[DELETE codeMgt] codeMgt seqNo : {}", codeMgt.getSeqNo());

        codeMgtRepository.deleteById(codeMgt.getSeqNo());
    }

    @Override
    public Long countCodeMgtGrpByGrpCd(String grpCd) {
        return codeMgtGrpRepository.countByGrpCd(grpCd);
    }

    @Override
    public Long countCodeMgtByDtlCd(String grpCd, String dtlCd) {
        return codeMgtRepository.countByCodeMgtGrp_GrpCdAndDtlCd(grpCd, dtlCd);
    }

    @Override
    public Optional<CodeMgt> findByDtlCd(String dtlCd) {
        return codeMgtRepository.findByDtlCd(dtlCd);
    }

    @Override
    public Optional<CodeMgtGrp> findByGrpCd(String grpCd) {
        return codeMgtGrpRepository.findByGrpCd(grpCd);
    }

    @Override
    public List<CodeMgt> findByDtlCd(String grpCd, String dtlCd) {
        return codeMgtRepository.findByDtlCd(grpCd, dtlCd);
    }


    @Override
    public CodeMgtDtlDTO updateCodeMgtDtl(CodeMgtDtlDTO codeMgtDtlDTO)
    {
        return codeMgtRepository.updateCodeMgtDtl(codeMgtDtlDTO);
    }


}

