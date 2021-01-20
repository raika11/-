package jmnet.moka.core.tps.mvc.editlog.service;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.editlog.dto.EditLogSearchDTO;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.repository.EditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 편집로그 Service Implementation class
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

    private final EditLogRepository editLogRepository;

    public EditLogServiceImpl(EditLogRepository editLogRepository) {
        this.editLogRepository = editLogRepository;
    }

    @Override
    public Page<EditLog> findAllEditLog(EditLogSearchDTO search) {
        return editLogRepository.findAllEditLog(search);
    }

    @Override
    public List<EditLog> findAllEditLog() {
        return editLogRepository.findAll();
    }

    @Override
    public Optional<EditLog> findEditLogBySeq(Long logSeq) {
        return editLogRepository.findEditLog(logSeq);
    }

    @Override
    @Transactional
    public EditLog insertEditLog(EditLog editLog) {
        log.debug("[INSERT EDITLOG] insert editLog, {}", editLog);
        editLog.setErrMsg(McpString.byteSubstring(editLog.getErrMsg(), 1000));
        return editLogRepository.save(editLog);
    }

    @Override
    public EditLog updateEditLog(EditLog editLog) {
        editLog.setErrMsg(McpString.byteSubstring(editLog.getErrMsg(), 1000));
        EditLog returnVal = editLogRepository.save(editLog);
        log.debug("[UPDATE EDITLOG] Edit Log SeqNo : {}", returnVal.getSeqNo());
        return returnVal;
    }

    @Override
    public void deleteEditLogBySeqNo(Long seqNo) {
        editLogRepository.deleteById(seqNo);
        log.debug("[DELETE EDITLOG] Edit Log seqNo : {}", seqNo);
    }

    @Override
    public void deleteEditLog(EditLog editLog) {
        this.deleteEditLogBySeqNo(editLog.getSeqNo());
    }
/*
    private EditLog makeEditLog(String memberId, ActionType action, String menuId, String successYn, String param) {
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
 */
}
