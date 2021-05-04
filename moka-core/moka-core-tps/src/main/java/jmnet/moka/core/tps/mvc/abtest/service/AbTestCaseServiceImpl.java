package jmnet.moka.core.tps.mvc.abtest.service;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseSaveDTO;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.entity.AbTestCase;
import jmnet.moka.core.tps.mvc.abtest.mapper.AbTestCaseMapper;
import jmnet.moka.core.tps.mvc.abtest.repository.AbTestCaseRepository;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseResultDtlVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseResultVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseSaveVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * ABTest 서비스
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abtest.service
 * ClassName : ABTestCaseServiceImpl
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 14:11
 */
@Service
public class AbTestCaseServiceImpl implements AbTestCaseService {

    @Autowired
    private MessageByLocale messageByLocale;

    @Autowired
    private AbTestCaseRepository abTestCaseRepository;

    @Autowired
    private AbTestCaseMapper abTestCaseMapper;

    @Override
    public Page<AbTestCaseResultVO> findResultList(AbTestCaseSearchDTO searchDTO) {
        List<AbTestCaseResultVO> list = abTestCaseMapper.findResultList(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }

    @Override
    public Page<AbTestCaseVO> findAllList(AbTestCaseSearchDTO searchDTO) {
        List<AbTestCaseVO> list = abTestCaseMapper.findAllList(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }

    @Override
    public List<AbTestCase> findChk(AbTestCaseSaveDTO abTestCaseSaveDTO) {

        String pageType = abTestCaseSaveDTO.getPageType();
        String pageValue = abTestCaseSaveDTO.getPageValue();
        String zoneDiv = abTestCaseSaveDTO.getZoneDiv();
        String zoneSeq = abTestCaseSaveDTO.getZoneSeq();
        String abtestPurpose = abTestCaseSaveDTO.getAbtestPurpose();

        return abTestCaseRepository.findByPageTypeAndPageValueAndZoneDivAndZoneSeqAndAbtestPurpose(pageType, pageValue, zoneDiv, zoneSeq,
                abtestPurpose);
    }

    @Override
    public AbTestCaseSaveVO findABTestById(Long abTestSeq) {
        return abTestCaseMapper.findABTestById(abTestSeq);
    }

    @Override
    public AbTestCaseResultDtlVO findABTestResultById(Long abTestSeq) {
        return abTestCaseMapper.findABTestResultById(abTestSeq);
    }

    @Override
    public Optional<AbTestCase> findById(Long abTestSeq) {
        return abTestCaseRepository.findById(abTestSeq);
    }

    @Override
    @Transactional
    public int insertABTestCase(AbTestCaseSaveVO abTestCaseSaveVO) {
        int abtestSeq = abTestCaseMapper.insertABTestCase(abTestCaseSaveVO);

        int rtn;

        if (abtestSeq == -1 && McpString.isEmpty(abTestCaseSaveVO.getAbtestSeq())) {
            rtn = abtestSeq;
        } else {
            rtn = abTestCaseSaveVO.getAbtestSeq();
        }
        return rtn;
    }

    @Override
    @Transactional
    public int updateABTestCase(AbTestCaseSaveVO abTestCaseSaveVO) {
        int abtestSeq = abTestCaseMapper.updateABTestCase(abTestCaseSaveVO);

        int rtn;

        if (abtestSeq == -1 && McpString.isEmpty(abTestCaseSaveVO.getAbtestSeq())) {
            rtn = abtestSeq;
        } else {
            rtn = abTestCaseSaveVO.getAbtestSeq();
        }
        return rtn;
    }

    @Override
    public void closeABTestCase(Long abtestSeq)
            throws NoDataException {
        AbTestCase abTestCase = abTestCaseRepository
                .findById(abtestSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    return new NoDataException(message);
                });
        abTestCase.setStatus(MokaConstants.ABTEST_STATUS_Q);
    }

    @Override
    public void deleteABTestCase(Long abtestSeq)
            throws NoDataException {
        AbTestCase abTestCase = abTestCaseRepository
                .findById(abtestSeq)
                .orElseThrow(() -> {
                    String message = messageByLocale.get("tps.common.error.no-data");
                    return new NoDataException(message);
                });
        abTestCase.setDelYn(MokaConstants.YES);
    }
}
