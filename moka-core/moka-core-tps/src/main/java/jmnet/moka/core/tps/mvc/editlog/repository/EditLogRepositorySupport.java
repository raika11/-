package jmnet.moka.core.tps.mvc.editlog.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.editlog.dto.EditLogSearchDTO;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import org.springframework.data.domain.Page;

/**
 * <pre>
 * Editlog Repository Support class
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editlog.repository
 * ClassName : EditLogRepositorySupport
 * Created : 2021-01-20 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-20 10:50
 */
public interface EditLogRepositorySupport {

    /**
     * 편집 로그 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<EditLog> findAllEditLog(EditLogSearchDTO searchDTO);

    /**
     * 편집 로그 조회
     *
     * @param seqNo 편집 로그 일련번호
     * @return 검색 결과
     */
    Optional<EditLog> findEditLog(Long seqNo);
}
