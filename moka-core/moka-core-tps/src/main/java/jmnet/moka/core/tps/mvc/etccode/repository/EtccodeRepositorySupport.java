/**
 * msp-tps EtccodeRepositorySupport.java 2020. 6. 18. 오후 3:54:13 ssc
 */
package jmnet.moka.core.tps.mvc.etccode.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeSearchDTO;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;

/**
 * <pre>
 * 
 * 2020. 6. 18. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 18. 오후 3:54:13
 * @author ssc
 */
public interface EtccodeRepositorySupport {

    // 사용중인 코드목록 조회(페이징X)
    public List<Etccode> findUseList(String codeTypeId);

    // 코드목록 조회(페이징O)
    public Page<Etccode> findList(EtccodeSearchDTO search, Pageable pageable);

}
