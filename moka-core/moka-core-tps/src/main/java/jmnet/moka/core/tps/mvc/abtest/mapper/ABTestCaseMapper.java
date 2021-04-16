package jmnet.moka.core.tps.mvc.abtest.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.abtest.dto.ABTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.vo.ABTestCaseVO;

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
     * @param abTestSeq 검색 조건
     * @return 조회 결과
     */
    List<ABTestCaseVO> findABTestById(Long abTestSeq);
}
