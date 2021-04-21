package jmnet.moka.core.tps.mvc.abtest.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.abtest.dto.AbTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.entity.AbTestCase;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseSaveVO;
import jmnet.moka.core.tps.mvc.abtest.vo.AbTestCaseVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.service
 * ClassName : ABTestCaseService
 * Created : 2021-04-15
 * </pre>
 *
 * @author
 * @since 2021-04-15 14:02
 */
public interface AbTestCaseService {
    Page<AbTestCaseVO> findAllList(AbTestCaseSearchDTO searchDTO);

    List<AbTestCaseVO> findABTestById(Long abtestSeq);

    Optional<AbTestCase> findById(Long abtestSeq);

    /**
     * ABTest 등록
     *
     * @param abTestCaseSaveVO 정보
     * @return 작업
     */
    int insertABTestCase(AbTestCaseSaveVO abTestCaseSaveVO);

    /**
     * ABTest 수정
     *
     * @param abTestCaseSaveVO 정보
     * @return 작업
     */
    int updateABTestCase(AbTestCaseSaveVO abTestCaseSaveVO);
}
