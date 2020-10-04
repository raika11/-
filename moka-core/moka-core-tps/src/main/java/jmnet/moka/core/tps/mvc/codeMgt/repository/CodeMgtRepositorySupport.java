/**
 * msp-tps CodeMgtRepositorySupport.java 2020. 6. 18. 오후 3:54:13 ssc
 */
package jmnet.moka.core.tps.mvc.codeMgt.repository;

import java.util.List;

import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.codeMgt.dto.CodeMgtSearchDTO;

/**
 * <pre>
 * 
 * 2020. 6. 18. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 18. 오후 3:54:13
 * @author ssc
 */
public interface CodeMgtRepositorySupport {

    // 사용중인 코드목록 조회(페이징X)
    public List<CodeMgt> findUseList(String grpCd);

    // 코드목록 조회(페이징O)
    public Page<CodeMgt> findList(CodeMgtSearchDTO search, Pageable pageable);

}
