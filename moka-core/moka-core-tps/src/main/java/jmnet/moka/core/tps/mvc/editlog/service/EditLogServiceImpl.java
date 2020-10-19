package jmnet.moka.core.tps.mvc.editlog.service;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.repository.EditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editlog.service
 * ClassName : EditLogServiceImpl
 * Created : 2020-10-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-19 14:03
 */
@Slf4j
@Service
public class EditLogServiceImpl implements EditLogService {

    private EditLogRepository editLogRepository;

    public EditLogServiceImpl(EditLogRepository editLogRepository) {
        this.editLogRepository = editLogRepository;
    }

    @Override
    public Page<EditLog> findAllEditLog(SearchDTO search) {
        return editLogRepository.findAll(search.getPageable());
    }

    @Override
    public List<EditLog> findAllEditLog() {
        return editLogRepository.findAll();
    }

    @Override
    public Optional<EditLog> findEditLogById(Long logSeq) {
        return editLogRepository.findById(logSeq);
    }

    @Override
    @Transactional
    public EditLog insertEditLog(EditLog editLog)
            throws Exception {
        log.debug("[INSERT DOMAIN] insert editLog, {}", editLog);
        return editLogRepository.save(editLog);
    }

    @Override
    public EditLog updateEditLog(EditLog editLog) {
        EditLog returnVal = editLogRepository.save(editLog);
        log.debug("[UPDATE DOMAIN] Edit Log SeqNo : {}", returnVal.getSeqNo());
        return returnVal;
    }

    @Override
    public void deleteEditLogBySeqNo(Long seqNo)
            throws Exception {
        editLogRepository.deleteById(seqNo);
        log.debug("[DELETE DOMAIN] Edit Log seqNo : {}", seqNo);
    }

    @Override
    public void deleteEditLog(EditLog editLog)
            throws Exception {
        this.deleteEditLogBySeqNo(editLog.getSeqNo());
    }

    private EditLog makeEditLog(String memberId, String action, String menuId, String successYn, String param) {
        return EditLog
                .builder()
                .action(action)
                .memberId(memberId)
                .menuId(menuId)
                .successYn(successYn)
                .param(param)
                .regIp(HttpHelper.getRemoteAddr())
                .build();
    }
}
