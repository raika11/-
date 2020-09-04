package jmnet.moka.core.tps.mvc.code.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.code.dto.CodeSearchDTO;
import jmnet.moka.core.tps.mvc.code.vo.CodeVO;

public interface CodeMapper extends BaseMapper<CodeVO, CodeSearchDTO> {

    /**
     * 검색코드 조회
     * @param search 검색조건
     * @return 검색코드 목록
     */
    List<CodeVO> findSearchCodes(CodeSearchDTO search);
    
    /**
     * 대분류코드 조회
     * @param search 검색조건
     * @return 대분류코드 목록
     */
    List<CodeVO> findLargeCodes(CodeSearchDTO search);
    
    /**
     * 중분류코드 조회
     * @param search 검색조건
     * @return 중분류코드 목록
     */
    List<CodeVO> findMiddleCodes(CodeSearchDTO search);
    
    /**
     * 소분류코드 조회
     * @param search 검색조건
     * @return 소분류코드 목록
     */
    List<CodeVO> findSmallCodes(CodeSearchDTO search);
}
