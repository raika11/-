package jmnet.moka.core.tps.mvc.abTest.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.abTest.dto.ABTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abTest.vo.ABTestCaseSaveVO;
import jmnet.moka.core.tps.mvc.abTest.vo.ABTestCaseVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abTest.mapper
 * ClassName : ABTestCaseMapper
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 13:19
 */
public interface ABTestCaseMapper extends BaseMapper<ABTestCaseVO, ABTestCaseSearchDTO> {

    /**
     * ABTest 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<ABTestCaseVO> findAllList(ABTestCaseSearchDTO searchDTO);

    /**
     * ABTest 상세 조회
     *
     * @param abtestSeq 검색 조건
     * @return 조회 결과
     */
    List<ABTestCaseVO> findABTestById(Long abtestSeq);

    /**
     * ABTest 등록
     *
     * @param abTestCaseSaveVO 등록
     * @return 조회 결과
     */
    int insertABTestCase(ABTestCaseSaveVO abTestCaseSaveVO);

}
