/**
 * msp-tps CodeMgtGrpRepository.java 2020. 6. 17. 오후 4:44:59 ssc
 */
package jmnet.moka.core.tps.mvc.codemgt.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오후 4:44:59
 */
@Repository
public interface CodeMgtGrpRepository extends JpaRepository<CodeMgtGrp, Long> {

    int countByGrpCd(String grpCd);

    // grpCd로 CodeMgt 조회
    Optional<CodeMgtGrp> findByGrpCd(String grpCd);

    /**
     * 코드 그룹 목록 조회
     *
     * @param secretYn 숨김여부
     * @param usedYn   사용여부
     * @return 코드그룹목록
     */
    Page<CodeMgtGrp> findBySecretYnAndUsedYn(String secretYn, String usedYn, Pageable pageable);
}
