package jmnet.moka.core.tps.mvc.abTest.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.abTest.dto.ABTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abTest.vo.ABTestCaseSaveVO;
import jmnet.moka.core.tps.mvc.abTest.vo.ABTestCaseVO;
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
public interface ABTestCaseService {
    Page<ABTestCaseVO> findAllList(ABTestCaseSearchDTO searchDTO);

    List<ABTestCaseVO> findABTestById(Long abtestSeq);

    /**
     * ABTest 등록
     *
     * @param abTestCaseSaveVO 정보
     * @return 작업
     */
    boolean insertABTestCase(ABTestCaseSaveVO abTestCaseSaveVO);
}
