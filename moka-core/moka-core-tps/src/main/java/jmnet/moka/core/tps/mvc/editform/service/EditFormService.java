package jmnet.moka.core.tps.mvc.editform.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.service
 * ClassName : EditFormService
 * Created : 2020-10-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-28 15:24
 */
public interface EditFormService {

    /**
     * 도메인목록조회
     *
     * @param search 검색조건
     * @return 도메인목록
     */
    public Page<EditForm> findAllEditForm(SearchDTO search);

    /**
     * 도메인목록 전체조회(페이징X)
     *
     * @return 도메인목록
     */
    public List<EditForm> findAllEditForm();

    /**
     * 도메인 조회
     *
     * @param editForm 편집폼
     * @return 편집폼정보
     */
    public Optional<EditForm> findEditForm(EditForm editForm);

    /**
     * 도메인 추가
     *
     * @param editForm 도메인
     * @return 등록된 도메인
     * @throws Exception 예외처리
     */
    public EditForm insertEditForm(EditForm editForm)
            throws Exception;

    /**
     * 도메인 수정
     *
     * @param editForm 수정할 편집폼정보
     * @return 수정된 편집폼정보
     */
    public EditForm updateEditForm(EditForm editForm);

    /**
     * 도메인 삭제
     *
     * @param editFormId 도메인아이디
     * @throws Exception 예외처리
     */
    public void deleteEditFormById(String editFormId)
            throws Exception;

    /**
     * 도메인 삭제
     *
     * @param editForm 도메인
     * @throws Exception 예외처리
     */
    public void deleteEditForm(EditForm editForm)
            throws Exception;

    /**
     * 중복 도메인아이디인지 체크한다
     *
     * @param editFormId 도메인아이디
     * @return 중복여부
     */
    public boolean isDuplicatedId(String editFormId);

    /**
     * 관련된 정보가 있는지 조사한다.
     *
     * @param editFormId 도메인아이디
     * @return 관련아이템 여부
     */
    public boolean hasRelations(String editFormId);
}
