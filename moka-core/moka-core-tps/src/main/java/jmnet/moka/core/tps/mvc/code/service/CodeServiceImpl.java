package jmnet.moka.core.tps.mvc.code.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.mapper.CodeMapper;
import jmnet.moka.core.tps.mvc.code.vo.CodeVO;

@Service
public class CodeServiceImpl implements CodeService {
    
    @Autowired
    private CodeMapper codeMapper;

    @Override
    public List<CodeVO> findSearchCodes(CodeSearchDTO search) {
        return codeMapper.findSearchCodes(search);
    }

    @Override
    public List<CodeVO> findLargeCodes(CodeSearchDTO search) {
        return codeMapper.findLargeCodes(search);
    }

    @Override
    public List<CodeVO> findMiddleCodes(CodeSearchDTO search) {
        return codeMapper.findMiddleCodes(search);
    }

    @Override
    public List<CodeVO> findSmallCodes(CodeSearchDTO search) {
        return codeMapper.findSmallCodes(search);
    }
}
