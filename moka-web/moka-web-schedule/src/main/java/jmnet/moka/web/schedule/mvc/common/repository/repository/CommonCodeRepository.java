package jmnet.moka.web.schedule.mvc.common.repository.repository;

import java.util.Optional;
import jmnet.moka.web.schedule.mvc.common.entity.CommonCode;
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
public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {

    /**
     * 콩통코드로 코드 상세 조회
     *
     * @param dtlCd 콩통코드
     * @return
     */
    Optional<CommonCode> findFirstByDtlCd(String dtlCd);


}
