/**
 * msp-tps EtccodeTypeRepository.java 2020. 6. 17. 오후 4:44:59 ssc
 */
package jmnet.moka.core.tps.mvc.etccode.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.etccode.entity.EtccodeType;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오후 4:44:59
 * @author ssc
 */
public interface EtccodeTypeRepository extends JpaRepository<EtccodeType, Long> {
    public Long countByCodeTypeId(String codeTypeId);
}
