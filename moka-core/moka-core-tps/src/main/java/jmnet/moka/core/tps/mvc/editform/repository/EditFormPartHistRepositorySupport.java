package jmnet.moka.core.tps.mvc.editform.repository;

import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartHistSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPartHist;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.repository
 * ClassName : EditFormPartHistRepositorySupport
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 13:26
 */
public interface EditFormPartHistRepositorySupport {
    Page<EditFormPartHist> findAll(EditFormPartHistSearchDTO editFormSearchDTO);
}
