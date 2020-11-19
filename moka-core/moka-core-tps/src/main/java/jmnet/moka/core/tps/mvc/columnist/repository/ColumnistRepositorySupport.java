package jmnet.moka.core.tps.mvc.columnist.repository;

import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.columnist.repository
 * ClassName : ColumnistRepositorySupport
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public interface ColumnistRepositorySupport {

    /**
     * 컬럼리스트 목록검색
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    public Page<Columnist> findAllColumnist(ColumnistSearchDTO searchDTO);
}
