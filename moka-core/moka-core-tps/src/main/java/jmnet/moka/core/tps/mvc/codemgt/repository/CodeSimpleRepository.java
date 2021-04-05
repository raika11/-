package jmnet.moka.core.tps.mvc.codemgt.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeSimple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 기타코트 Repository
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 6:14:50
 */
@Repository
public interface CodeSimpleRepository extends JpaRepository<CodeSimple, Long>, CodeMgtRepositorySupport {

    /**
     * 그룹코드와 사용여부로 코드 목록 조회
     *
     * @param grpCd  그룹 코드
     * @param usedYn 사용여부
     * @return
     */
    List<CodeSimple> findByGrpCdAndUsedYnOrderByCdOrd(String grpCd, String usedYn);


}
