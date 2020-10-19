package jmnet.moka.core.tps.mvc.editlog.service;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editlog.service
 * ClassName : EditLogService
 * Created : 2020-10-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-19 14:13
 */
public interface EditLogService {
    Page<EditLog> findAllEditLog(SearchDTO search);

    List<EditLog> findAllEditLog();

    Optional<EditLog> findEditLogById(Long logSeq);

    @Transactional
    EditLog insertEditLog(EditLog editLog)
            throws Exception;

    EditLog updateEditLog(EditLog editLog);

    void deleteEditLogBySeqNo(Long seqNo)
            throws Exception;

    void deleteEditLog(EditLog editLog)
            throws Exception;
}
