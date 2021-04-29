package jmnet.moka.core.tps.mvc.abtest.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseResultVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseSaveVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abtest.mapper
 * ClassName : ABTestCaseMapper
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 13:19
 */
public interface AbTestCaseMapper extends BaseMapper<AbTestCaseVO, AbTestCaseSearchDTO> {

    /**
     * ABTest 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<AbTestCaseResultVO> findResultList(AbTestCaseSearchDTO searchDTO);

    /**
     * ABTest 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 조회 결과
     */
    List<AbTestCaseVO> findAllList(AbTestCaseSearchDTO searchDTO);

    /**
     * ABTest 상세 조회
     *
     * @param abtestSeq 검색 조건
     * @return 조회 결과
     */
    AbTestCaseSaveVO findABTestById(Long abtestSeq);

    /**
     * ABTest 등록
     *
     * @param abTestCaseSaveVO 등록
     * @return 조회 결과
     */
    int insertABTestCase(AbTestCaseSaveVO abTestCaseSaveVO);

    /**
     * ABTest 수정
     *
     * @param abTestCaseSaveVO 수정
     * @return 조회 결과
     */
    int updateABTestCase(AbTestCaseSaveVO abTestCaseSaveVO);

}
