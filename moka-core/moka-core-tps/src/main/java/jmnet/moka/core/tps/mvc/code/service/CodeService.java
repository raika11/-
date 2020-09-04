package jmnet.moka.core.tps.mvc.code.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.vo.CodeVO;

/**
 * 코드 서비스
 * @author jeon
 *
 */
public interface CodeService {

    /**
     * 분류코드 목록을 가져온다(중분류까지, codePath 있음)
     * @param search 검색조건
     * @return CodeVO 리스트
     */
    List<CodeVO> findSearchCodes(CodeSearchDTO search);
    
    /**
     * 대분류 목록을 가져온다
     * @param search 검색조건
     * @return 대분류 목록
     */
    List<CodeVO> findLargeCodes(CodeSearchDTO search);
    
    /**
     * 중분류 목록을 가져온다
     * @param search 검색조건
     * @return 중분류 목록
     */
    List<CodeVO> findMiddleCodes(CodeSearchDTO search);
    
    /**
     * 소분류 목록을 가져온다
     * @param search 검색조건
     * @return 소분류 목록
     */
    List<CodeVO> findSmallCodes(CodeSearchDTO search);
}
