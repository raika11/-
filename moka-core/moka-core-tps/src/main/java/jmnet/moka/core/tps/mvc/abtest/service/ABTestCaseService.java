package jmnet.moka.core.tps.mvc.abtest.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.abtest.dto.ABTestCaseSearchDTO;
import jmnet.moka.core.tps.mvc.abtest.vo.ABTestCaseVO;
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

    List<ABTestCaseVO> findABTestById(Long abTestSeq);
}
