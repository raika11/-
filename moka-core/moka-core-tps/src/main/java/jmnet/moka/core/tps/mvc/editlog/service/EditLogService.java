package jmnet.moka.core.tps.mvc.editlog.service;

import java.util.Optional;
import javax.transaction.Transactional;
import jmnet.moka.core.tps.mvc.editlog.dto.EditLogSearchDTO;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import org.springframework.data.domain.Page;

/**
 * <pre>
 * 편집로그 Service
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
    /**
     * 편집로그 목록 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<EditLog> findAllEditLog(EditLogSearchDTO search);

    /**
     * 편집로그 상세 조회
     *
     * @param logSeq 편집로그 일련번호
     * @return 편집로그
     */
    Optional<EditLog> findEditLogBySeq(Long logSeq);

    /**
     * 편집로그 등록
     *
     * @param editLog 편집로그 정보
     * @return 등록결과
     */
    @Transactional
    EditLog insertEditLog(EditLog editLog);

    /**
     * 편집로그 수정
     *
     * @param editLog 편집로그 정보
     * @return 수정결과
     */
    EditLog updateEditLog(EditLog editLog);

    /**
     * 편집로그 삭제
     *
     * @param seqNo 편집로그 일련번호
     */
    void deleteEditLogBySeqNo(Long seqNo);

    /**
     * 편집로그 삭제
     *
     * @param editLog 편집로그 정보
     */
    void deleteEditLog(EditLog editLog);
}
