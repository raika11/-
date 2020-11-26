package jmnet.moka.core.tps.mvc.codemgt.repository;

import java.util.List;
import java.util.Optional;

import com.querydsl.core.QueryResults;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
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
public interface CodeMgtRepository extends JpaRepository<CodeMgt, Long>, CodeMgtRepositorySupport {

    // 그룹별 코드의 갯수(그룹의 하위 데이타가 존재하는지 조사하기 위함)
    public Long countByCodeMgtGrp_GrpCd(String grpCd);

    // 특정그룹에서 해당하는 dtlCd의 갯수(dtlCd가 중복되지 않게 하기 위해 조회함)
    public Long countByCodeMgtGrp_GrpCdAndDtlCd(String grpCd, String dtlCd);

    // dtlCd로 CodeMgt 조회
    public Optional<CodeMgt> findByDtlCd(String dtlCd);

    List<CodeMgt> findByDtlCd(String grpCd, String dtlCd);
}
