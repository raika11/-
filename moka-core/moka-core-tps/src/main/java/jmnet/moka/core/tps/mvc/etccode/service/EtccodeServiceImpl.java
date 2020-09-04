package jmnet.moka.core.tps.mvc.etccode.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeSearchDTO;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;
import jmnet.moka.core.tps.mvc.etccode.entity.EtccodeType;
import jmnet.moka.core.tps.mvc.etccode.repository.EtccodeRepository;
import jmnet.moka.core.tps.mvc.etccode.repository.EtccodeTypeRepository;

/**
 * <pre>
 * 기타코드 Service Impl
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 6:17:33
 * @author jeon
 */
@Service
public class EtccodeServiceImpl implements EtccodeService {

    private static final Logger logger = LoggerFactory.getLogger(EtccodeServiceImpl.class);

    @Autowired
    private EtccodeRepository etccodeRepository;

    @Autowired
    private EtccodeTypeRepository etccodeTypeRepository;

    private final EntityManager entityManager;

    @Autowired
    public EtccodeServiceImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<Etccode> findUseList(String codeTypeId) {
        return etccodeRepository.findUseList(codeTypeId);
    }

    @Override
    public Page<Etccode> findList(EtccodeSearchDTO search, Pageable pageable) {
        return etccodeRepository.findList(search, pageable);
    }

    @Override
    public Page<EtccodeType> findTypeList(Pageable pageable) {
        return etccodeTypeRepository.findAll(pageable);
    }

    @Override
    public Optional<EtccodeType> findByCodeTypeSeq(Long codeTypeSeq) {
        return etccodeTypeRepository.findById(codeTypeSeq);
    }

    @Override
    public EtccodeType insertEtccodeType(EtccodeType etccodeType) {
        return etccodeTypeRepository.save(etccodeType);
    }

    @Override
    public EtccodeType updateEtccodeType(EtccodeType etccodeType) {
        return etccodeTypeRepository.save(etccodeType);
    }

    @Override
    public void deleteEtccodeType(EtccodeType etccodeType, String name) {
        logger.info("[DELETE etccodeType] codeTypeSeq : {}", etccodeType.getCodeTypeSeq());

        etccodeTypeRepository.deleteById(etccodeType.getCodeTypeSeq());
    }

    @Override
    public Long countEtccodeByCodeTypeId(String codeTypeId) {
        return etccodeRepository.countByEtccodeType_CodeTypeId(codeTypeId);
    }

    @Override
    public Optional<Etccode> findBySeq(Long seq) {
        return etccodeRepository.findById(seq);
    }

    @Override
    @Transactional
    public Etccode insertEtccode(Etccode etccode) {
        Etccode returnEtccode = etccodeRepository.save(etccode);
        entityManager.refresh(returnEtccode);
        return returnEtccode;
    }

    @Override
    public Etccode updateEtccode(Etccode etccode) {
        return etccodeRepository.save(etccode);
    }

    @Override
    public void deleteEtccode(Etccode etccode, String name) {
        logger.info("[DELETE etccode] seq : {}", etccode.getSeq());

        etccodeRepository.deleteById(etccode.getSeq());
    }

    @Override
    public Long countEtccodeTypeByCodeTypeId(String codeTypeId) {
        return etccodeTypeRepository.countByCodeTypeId(codeTypeId);
    }

    @Override
    public Long countEtccodeByCodeId(String codeTypeId, String codeId) {
        return etccodeRepository.countByEtccodeType_CodeTypeIdAndCodeId(codeTypeId, codeId);
    }

    @Override
    public Optional<Etccode> findByCodeId(String codeId) {
        return etccodeRepository.findByCodeId(codeId);
    }

}

