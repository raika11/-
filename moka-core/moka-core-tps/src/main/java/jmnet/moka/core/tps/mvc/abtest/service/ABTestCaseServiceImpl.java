package jmnet.moka.core.tps.mvc.abtest.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.abtest.dto.ABTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.mapper.ABTestCaseMapper;
import jmnet.moka.core.tps.mvc.abtest.vo.ABTestCaseVO;
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
public class ABTestCaseServiceImpl implements ABTestCaseService {

    @Autowired
    private ABTestCaseMapper abTestCaseMapper;

    @Override
    public Page<ABTestCaseVO> findAllList(ABTestCaseSearchDTO searchDTO) {
        List<ABTestCaseVO> list = abTestCaseMapper.findAllList(searchDTO);
        return new PageImpl<>(list, searchDTO.getPageable(), searchDTO.getTotal() == null ? 0 : searchDTO.getTotal());
    }

    @Override
    public List<ABTestCaseVO> findABTestById(Long abTestSeq) {
        List<ABTestCaseVO> list = abTestCaseMapper.findABTestById(abTestSeq);
        return list;
    }



}
