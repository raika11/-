package jmnet.moka.core.tps.mvc.etccode.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;

/**
 * <pre>
 * 기타코트 Repository
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 6:14:50
 * @author jeon
 */
public interface EtccodeRepository extends JpaRepository<Etccode, Long>, EtccodeRepositorySupport {

    // 그룹별 코드의 갯수(그룹의 하위 데이타가 존재하지 조사하기 위함)
    public Long countByEtccodeType_CodeTypeId(String codeTypeId);

    // 특정그룹에서 해당하는 codeId의 갯수(codeId가 중복되지 않게 하기 위해 조회함)
    public Long countByEtccodeType_CodeTypeIdAndCodeId(String codeTypeId, String codeId);
    
    // codeId로 etccode 조회
    public Optional<Etccode> findByCodeId(String codeId);
}
