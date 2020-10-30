package jmnet.moka.core.tps.mvc.editform.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.common.code.EditFormStatusCode;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormItem;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormItemHist;
import jmnet.moka.core.tps.mvc.editform.mapper.EditFormItemMapper;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormItemHistRepository;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormItemRepository;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.service
 * ClassName : EditFormServiceImpl
 * Created : 2020-10-28 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-28 15:22
 */
@Slf4j
@Service
public class EditFormServiceImpl implements EditFormService {

    private final EditFormRepository editFormRepository;

    private final EditFormItemRepository editFormItemRepository;

    private final EditFormItemHistRepository editFormItemHistRepository;

    private final EditFormItemMapper editFormItemMapper;

    public EditFormServiceImpl(EditFormRepository editFormRepository, EditFormItemRepository editFormItemRepository,
            EditFormItemHistRepository editFormItemHistRepository, EditFormItemMapper editFormItemMapper) {
        this.editFormRepository = editFormRepository;
        this.editFormItemRepository = editFormItemRepository;
        this.editFormItemHistRepository = editFormItemHistRepository;
        this.editFormItemMapper = editFormItemMapper;
    }


    @Override
    public Page<EditForm> findAllEditForm(EditFormSearchDTO search) {
        return editFormRepository.findAll(search.getPageable());
    }

    @Override
    public List<EditForm> findAllEditForm() {
        return editFormRepository.findAll();
    }

    @Override
    public Optional<EditForm> findEditFormBySeq(Long formSeq) {
        return editFormRepository.findById(formSeq);
    }

    @Override
    public Optional<EditForm> findEditFormById(String formId) {
        return editFormRepository.findByFormId(formId);
    }

    @Override
    public Optional<EditForm> findEditForm(EditForm editForm) {
        return editFormRepository.findByFormId(editForm.getFormId());
    }

    @Override
    public Optional<EditFormItem> findEditFormItemBySeq(Long itemSeq) {
        return editFormItemRepository.findById(itemSeq);
    }

    @Override
    public Optional<EditFormItem> findEditFormItem(EditFormItem editFormItem) {
        return editFormItemRepository.findEditFormItem(editFormItem);
    }

    @Override
    public EditForm insertEditForm(EditForm editForm)
            throws Exception {
        return editFormRepository.save(editForm);
    }

    @Override
    public EditFormItem insertEditFormItem(EditFormItem editFormItem)
            throws Exception {
        editFormItem = editFormItemRepository.save(editFormItem);
        if (editFormItem.getItemSeq() > 0) {
            editFormItemHistRepository.save(EditFormItemHist
                    .builder()
                    .itemSeq(editFormItem.getItemSeq())
                    .formData(editFormItem.getFormData())
                    .status(EditFormStatusCode.PUBLISH)
                    .approvalYn(MokaConstants.YES)
                    .build());
        }
        return editFormItem;
    }

    @Override
    public EditFormItem insertEditFormItem(EditFormItem editFormItem, EditFormStatusCode status, Date reserveDt)
            throws MokaException {
        // 예약 여부 체크
        boolean isReserved = false;
        String approvalYn = MokaConstants.NO;
        if (status == EditFormStatusCode.PUBLISH) {
            if (reserveDt != null) {
                if (McpDate
                        .now()
                        .compareTo(reserveDt) <= 0) {
                    approvalYn = MokaConstants.YES;
                } else {
                    //PUBLISH 상태이지만, 예약일시가 도래하지 않은 정보는 item의 formData를 null로 처리하고 useYn을 N으로 처리한다.
                    isReserved = true;
                    editFormItem.setUsedYn(MokaConstants.NO);
                }
            } else {
                // 예약 발송 아님
                approvalYn = MokaConstants.YES;
            }
        } else {
            // 신규 등록시
            editFormItem.setUsedYn(MokaConstants.NO);
        }

        editFormItem = editFormItemRepository.save(editFormItem);

        if (editFormItem.getItemSeq() > 0) {
            EditFormItemHist itemHist = editFormItemHistRepository.save(EditFormItemHist
                    .builder()
                    .itemSeq(editFormItem.getItemSeq())
                    .formData(editFormItem.getFormData())
                    .status(status)
                    .reserveDt(reserveDt)
                    .approvalYn(approvalYn)
                    .build());
            if (isReserved) {
                reservePublish(itemHist.getSeqNo(), McpDate.term(reserveDt));
            }
        }
        return editFormItem;
    }

    @Override
    public EditForm updateEditForm(EditForm editForm) {
        editForm = editFormRepository.save(editForm);
        editForm
                .getEditFormItems()
                .forEach(item -> {
                    try {
                        updateEditFormItem(item);
                    } catch (Exception e) {
                        log.error(e.toString());
                    }
                });
        return null;
    }

    @Override
    public EditFormItem updateEditFormItem(EditFormItem editFormItem) {
        editFormItem = editFormItemRepository.save(editFormItem);
        if (editFormItem.getItemSeq() > 0) {
            editFormItemHistRepository.save(EditFormItemHist
                    .builder()
                    .itemSeq(editFormItem.getItemSeq())
                    .formData(editFormItem.getFormData())
                    .build());
        }
        return editFormItem;
    }

    public EditFormItem updateEditFormItem(EditFormItem editFormItem, EditFormStatusCode status, Date reserveDt)
            throws MokaException {
        String formData = editFormItem.getFormData();
        // 예약 여부 체크
        boolean isReserved = false;
        String approvalYn = MokaConstants.NO;
        if (status == EditFormStatusCode.PUBLISH) {
            if (reserveDt != null) {
                if (McpDate
                        .now()
                        .compareTo(reserveDt) <= 0) {
                    approvalYn = MokaConstants.YES;
                } else {
                    //PUBLISH 상태이지만, 예약일시가 도래하지 않은 정보는 item의 formData를 null로 처리하고 useYn을 N으로 처리한다.
                    isReserved = true;
                }
            } else {
                // 예약 발송 아님
                approvalYn = MokaConstants.YES;
            }
        }
        if (!isReserved && McpString.isYes(approvalYn)) {
            editFormItem = editFormItemRepository.save(editFormItem);
        }

        EditFormItemHist itemHist = editFormItemHistRepository.save(EditFormItemHist
                .builder()
                .itemSeq(editFormItem.getItemSeq())
                .formData(formData)
                .status(status)
                .reserveDt(reserveDt)
                .approvalYn(approvalYn)
                .build());
        if (isReserved) {
            reservePublish(itemHist.getSeqNo(), McpDate.term(reserveDt));
        }
        return editFormItem;
    }

    /**
     * 예약 배포 처리
     *
     * @param seqNo             편집 폼 아이템 일련번호
     * @param sleepMilliseconds waiting milliseconds
     * @throws MokaException
     */
    @Async
    public void reservePublish(Long seqNo, long sleepMilliseconds)
            throws MokaException {
        try {
            Thread.sleep(sleepMilliseconds);
            editFormItemHistRepository
                    .findById(seqNo)
                    .ifPresent(editFormItemHist -> {
                        editFormItemHist.setApprovalYn(MokaConstants.YES);
                        editFormItemHistRepository.save(editFormItemHist);
                    });
        } catch (InterruptedException ie) {
            log.error("Edit Form publish failed : {}", seqNo, ie);
        }
    }

    @Override
    public int deleteEditFormBySeq(Long formSeq)
            throws Exception {
        return deleteEditFormItem(formSeq, 0L);
    }

    @Override
    public int deleteEditFormItem(Long formSeq, Long itemSeq)
            throws Exception {
        return editFormItemMapper.delete(EditFormSearchDTO
                .builder()
                .formSeq(formSeq)
                .itemSeq(itemSeq)
                .build());
    }

    @Override
    public boolean isDuplicatedId(EditForm editForm) {
        return editFormRepository
                .findByFormId(editForm.getFormId())
                .isPresent();
    }

    @Override
    public boolean isDuplicatedId(EditFormItem editFormItem) {
        return editFormItemRepository
                .findEditFormItem(editFormItem)
                .isPresent();
    }

    @Override
    public boolean isUsedPage(Long formSeq) {
        return false;
    }

}
