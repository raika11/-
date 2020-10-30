/**
 * msp-tps CodeMgtRepositorySupport.java 2020. 6. 18. 오후 3:54:13 ssc
 */
package jmnet.moka.core.tps.mvc.codemgt.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * 2020. 6. 18. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 18. 오후 3:54:13
 */
public interface CodeMgtRepositorySupport {

    // 사용중인 코드목록 조회(페이징X)
    public List<CodeMgt> findUseList(String grpCd);

    // 코드목록 조회(페이징O)
    public Page<CodeMgt> findList(CodeMgtSearchDTO search, Pageable pageable);

}
