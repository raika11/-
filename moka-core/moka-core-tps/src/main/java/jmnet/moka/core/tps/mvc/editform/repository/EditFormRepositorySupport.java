package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.repository
 * ClassName : EditFormRepositorySupport
 * Created : 2021-01-19 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-19 14:11
 */
public interface EditFormRepositorySupport {
    /**
     * 에디트폼 목록 조회
     *
     * @param searchDTO 검색 조건
     * @return 검색 결과
     */
    Page<EditForm> findAllEditForm(SearchDTO searchDTO);
}
