package jmnet.moka.core.tps.mvc.editform.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.common.code.EditFormStatusCode;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormItem;
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
    public Page<EditForm> findAllEditForm(EditFormSearchDTO search);

    /**
     * 편집 폼목록 전체조회(페이징X)
     *
     * @return 편집 폼목록
     */
    public List<EditForm> findAllEditForm();

    /**
     * 편집 폼 조회
     *
     * @param formSeq 편집폼 일련번호
     * @return 편집폼정보
     */
    public Optional<EditForm> findEditFormBySeq(Long formSeq);

    /**
     * 편집 폼 조회
     *
     * @param formId 편집폼 ID
     * @return 편집폼정보
     */
    public Optional<EditForm> findEditFormById(String formId);

    /**
     * 편집 폼 건수
     *
     * @param formId 편집폼 ID
     * @return 편집폼정보
     */
    public int countEditFormById(String formId);

    /**
     * 편집 폼 조회
     *
     * @param editForm 편집폼
     * @return 편집폼정보
     */
    public Optional<EditForm> findEditForm(EditForm editForm);

    /**
     * 편집 폼 조회
     *
     * @param itemSeq 편집폼 아이템 일련번호
     * @return 편집폼 아이템 정보
     */
    public Optional<EditFormItem> findEditFormItemBySeq(Long itemSeq);

    /**
     * 편집 폼 조회
     *
     * @param editFormItem 편집폼
     * @return 편집폼정보
     */
    public Optional<EditFormItem> findEditFormItem(EditFormItem editFormItem);

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
     * 편집 폼 추가
     *
     * @param editFormItem 편집 폼
     * @return 등록된 편집 폼
     * @throws Exception 예외처리
     */
    public EditFormItem insertEditFormItem(EditFormItem editFormItem)
            throws Exception;

    /**
     * 편집 폼 추가
     *
     * @param editFormItem 편집 폼
     * @return 등록된 편집 폼
     * @throws Exception 예외처리
     */
    public EditFormItem insertEditFormItem(EditFormItem editFormItem, EditFormStatusCode status, Date reserveDt)
            throws MokaException;

    /**
     * 편집 폼 수정
     *
     * @param editForm 수정할 편집폼정보
     * @return 수정된 편집폼정보
     */
    public EditForm updateEditForm(EditForm editForm);

    /**
     * 편집 폼 수정
     *
     * @param editFormItem 수정할 편집폼정보
     * @return 수정된 편집폼정보
     */
    public EditFormItem updateEditFormItem(EditFormItem editFormItem);

    /**
     * 편집 폼 수정
     *
     * @param editFormItem 수정할 편집폼정보
     * @param status       편집 폼 상태
     * @param reserveDt    예약 일시
     * @return 수정된 편집폼정보
     */
    public EditFormItem updateEditFormItem(EditFormItem editFormItem, EditFormStatusCode status, Date reserveDt)
            throws Exception;

    /**
     * 편집 폼 삭제
     *
     * @param formSeq 편집 폼 일련번호
     * @throws Exception 예외처리
     */
    public int deleteEditFormBySeq(Long formSeq)
            throws Exception;

    /**
     * 편집 폼 삭제
     *
     * @param formSeq 편집 폼 일련번호
     * @param itemSeq 편집 폼 아이템 일련번호
     * @throws Exception 예외처리
     */
    public int deleteEditFormItem(Long formSeq, Long itemSeq)
            throws Exception;


    /**
     * 중복 편집 폼 아이디인지 체크한다
     *
     * @param editForm 폼 정보
     * @return 중복여부
     */
    public boolean isDuplicatedId(EditForm editForm);

    /**
     * 중복 편집 폼 아이디인지 체크한다
     *
     * @param editFormItem 폼 정보
     * @return 중복여부
     */
    public boolean isDuplicatedId(EditFormItem editFormItem);

    /**
     * 관련된 정보가 있는지 조사한다.
     *
     * @param editFormSeq 폼 일련번호
     * @return 사용여부
     */
    public boolean isUsedPage(Long editFormSeq);
}
