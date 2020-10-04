/**
 * msp-tps CodeMgtGrpRepository.java 2020. 6. 17. 오후 4:44:59 ssc
 */
package jmnet.moka.core.tps.mvc.codeMgt.repository;

import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgtGrp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오후 4:44:59
 * @author ssc
 */
@Repository
public interface CodeMgtGrpRepository extends JpaRepository<CodeMgtGrp, Long> {
    public Long countByGrpCd(String grpCd);
}
