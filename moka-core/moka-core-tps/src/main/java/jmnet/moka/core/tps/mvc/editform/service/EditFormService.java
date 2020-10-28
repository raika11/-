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
     * 편집 폼목록조회
     *
     * @param search 검색조건
     * @return 편집 폼목록
     */
    public Page<EditForm> findAllEditForm(SearchDTO search);

    /**
     * 편집 폼목록 전체조회(페이징X)
     *
     * @return 편집 폼목록
     */
    public List<EditForm> findAllEditForm();

    /**
     * 편집 폼 조회
     *
     * @param editForm 편집폼
     * @return 편집폼정보
     */
    public Optional<EditForm> findEditForm(EditForm editForm);

    /**
     * 편집 폼 추가
     *
     * @param editForm 편집 폼
     * @return 등록된 편집 폼
     * @throws Exception 예외처리
     */
    public EditForm insertEditForm(EditForm editForm)
            throws Exception;

    /**
     * 편집 폼 수정
     *
     * @param editForm 수정할 편집폼정보
     * @return 수정된 편집폼정보
     */
    public EditForm updateEditForm(EditForm editForm);

    /**
     * 편집 폼 삭제
     *
     * @param editFormId 편집 폼아이디
     * @throws Exception 예외처리
     */
    public void deleteEditFormById(String editFormId)
            throws Exception;

    /**
     * 편집 폼 삭제
     *
     * @param editForm 편집 폼
     * @throws Exception 예외처리
     */
    public void deleteEditForm(EditForm editForm)
            throws Exception;

    /**
     * 중복 편집 폼 아이디인지 체크한다
     *
     * @param editForm 폼 정보
     * @return 중복여부
     */
    public boolean isDuplicatedId(EditForm editForm);

    /**
     * 관련된 정보가 있는지 조사한다.
     *
     * @param editFormSeq 폼 일련번호
     * @return 사용여부
     */
    public boolean isUsedPage(Long editFormSeq);
}
