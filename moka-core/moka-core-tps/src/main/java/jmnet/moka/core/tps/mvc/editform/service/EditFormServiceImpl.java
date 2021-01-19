package jmnet.moka.core.tps.mvc.editform.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartHistSearchDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartSearchDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPartHist;
import jmnet.moka.core.tps.mvc.editform.mapper.EditFormPartMapper;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormPartHistRepository;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormPartRepository;
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

    private final EditFormPartRepository editFormPartRepository;

    private final EditFormPartHistRepository editFormPartHistRepository;

    private final EditFormPartMapper editFormPartMapper;

    public EditFormServiceImpl(EditFormRepository editFormRepository, EditFormPartRepository editFormPartRepository,
            EditFormPartHistRepository editFormPartHistRepository, EditFormPartMapper editFormPartMapper) {
        this.editFormRepository = editFormRepository;
        this.editFormPartRepository = editFormPartRepository;
        this.editFormPartHistRepository = editFormPartHistRepository;
        this.editFormPartMapper = editFormPartMapper;
    }


    @Override
    public Page<EditForm> findAllEditForm(EditFormSearchDTO search) {
        return editFormRepository.findAllEditForm(search);
    }

    @Override
    public Page<EditFormPart> findAllEditFormPart(EditFormPartSearchDTO search) {
        return editFormPartRepository.findAll(search);
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

    public int countEditFormById(String formId) {
        return editFormRepository.countByFormId(formId);
    }

    @Override
    public Optional<EditForm> findEditForm(EditForm editForm) {
        return editFormRepository.findByFormId(editForm.getFormId());
    }


    @Override
    public Optional<EditFormPart> findEditFormPartBySeq(Long partSeq) {
        return editFormPartRepository.findById(partSeq);
    }

    @Override
    public Optional<EditFormPart> findEditFormPart(EditFormPart editFormPart) {
        return editFormPartRepository.findEditFormPart(editFormPart);
    }

    @Override
    public EditForm insertEditForm(EditForm editForm)
            throws Exception {
        return editFormRepository.save(editForm);
    }

    @Override
    public EditFormPart insertEditFormPart(EditFormPart editFormPart)
            throws Exception {
        editFormPart = editFormPartRepository.save(editFormPart);
        if (editFormPart.getPartSeq() > 0) {
            editFormPartHistRepository.save(EditFormPartHist
                    .builder()
                    .partSeq(editFormPart.getPartSeq())
                    .formData(editFormPart.getFormData())
                    .status(EditStatusCode.PUBLISH)
                    .approvalYn(MokaConstants.YES)
                    .build());
        }
        return editFormPart;
    }

    @Override
    public EditFormPart insertEditFormPart(EditFormPart editFormPart, EditStatusCode status, Date reserveDt)
            throws MokaException {
        // 예약 여부 체크
        boolean isReserved = false;
        String approvalYn = MokaConstants.NO;
        if (status == EditStatusCode.PUBLISH) {
            if (reserveDt != null) {
                if (McpDate
                        .now()
                        .compareTo(reserveDt) <= 0) {
                    approvalYn = MokaConstants.YES;
                } else {
                    //PUBLISH 상태이지만, 예약일시가 도래하지 않은 정보는 part의 formData를 null로 처리하고 useYn을 N으로 처리한다.
                    isReserved = true;
                    editFormPart.setUsedYn(MokaConstants.NO);
                }
            } else {
                // 예약 발송 아님
                approvalYn = MokaConstants.YES;
            }
        } else {
            // 신규 등록시
            editFormPart.setUsedYn(MokaConstants.NO);
        }

        editFormPart = editFormPartRepository.save(editFormPart);

        if (editFormPart.getPartSeq() > 0) {
            EditFormPartHist partHist = editFormPartHistRepository.save(EditFormPartHist
                    .builder()
                    .partSeq(editFormPart.getPartSeq())
                    .formData(editFormPart.getFormData())
                    .status(status)
                    .reserveDt(reserveDt)
                    .approvalYn(approvalYn)
                    .build());
            if (isReserved) {
                reservePublish(partHist.getSeqNo(), McpDate.term(reserveDt));
            }
        }
        return editFormPart;
    }

    @Override
    public EditForm updateEditForm(EditForm editForm) {
        editForm = editFormRepository.save(editForm);
        editForm
                .getEditFormParts()
                .forEach(part -> {
                    try {
                        updateEditFormPart(part);
                    } catch (Exception e) {
                        log.error(e.toString());
                    }
                });
        return editForm;
    }

    @Override
    public EditFormPart updateEditFormPart(EditFormPart editFormPart) {
        editFormPart = editFormPartRepository.save(editFormPart);
        if (editFormPart.getPartSeq() > 0) {
            editFormPartHistRepository.save(EditFormPartHist
                    .builder()
                    .partSeq(editFormPart.getPartSeq())
                    .formData(editFormPart.getFormData())
                    .build());
        }
        return editFormPart;
    }

    public EditFormPart updateEditFormPart(EditFormPart editFormPart, EditStatusCode status, Date reserveDt)
            throws MokaException {
        String formData = editFormPart.getFormData();
        // 예약 여부 체크
        boolean isReserved = false;
        String approvalYn = MokaConstants.NO;
        if (status == EditStatusCode.PUBLISH) {
            if (reserveDt != null) {
                if (McpDate
                        .now()
                        .compareTo(reserveDt) <= 0) {
                    approvalYn = MokaConstants.YES;
                } else {
                    //PUBLISH 상태이지만, 예약일시가 도래하지 않은 정보는 part의 formData를 null로 처리하고 useYn을 N으로 처리한다.
                    isReserved = true;
                    editFormPart.setUsedYn(MokaConstants.NO);
                }
            } else {
                // 예약 발송 아님
                approvalYn = MokaConstants.YES;
            }
        } else {
            // 수정시에는 status가  PUBLISH이면 part 테이블에 저장하지 않는다.
            editFormPart = editFormPartRepository.save(editFormPart);
        }

        EditFormPartHist partHist = editFormPartHistRepository.save(EditFormPartHist
                .builder()
                .partSeq(editFormPart.getPartSeq())
                .formData(formData)
                .status(status)
                .reserveDt(reserveDt)
                .approvalYn(approvalYn)
                .build());
        if (isReserved) {
            reservePublish(partHist.getSeqNo(), McpDate.term(reserveDt));
        }
        return editFormPart;
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
            editFormPartHistRepository
                    .findById(seqNo)
                    .ifPresent(editFormPartHist -> {
                        editFormPartHist.setApprovalYn(MokaConstants.YES);
                        editFormPartHistRepository.save(editFormPartHist);
                    });
        } catch (InterruptedException ie) {
            log.error("Edit Form publish failed : {}", seqNo, ie);
        }
    }

    @Override
    public int deleteEditFormBySeq(Long formSeq)
            throws Exception {
        return editFormPartMapper.delete(EditFormSearchDTO
                .builder()
                .formSeq(formSeq)
                .partSeq(0L)
                .build());
    }

    @Override
    public int deleteEditFormPart(Long partSeq)
            throws Exception {
        return editFormPartMapper.delete(EditFormSearchDTO
                .builder()
                .formSeq(0L)
                .partSeq(partSeq)
                .build());
    }

    @Override
    public boolean isDuplicatedId(EditForm editForm) {
        return editFormRepository
                .findByFormId(editForm.getFormId())
                .isPresent();
    }

    @Override
    public boolean isDuplicatedId(EditFormPart editFormPart) {
        return editFormPartRepository
                .findEditFormPart(editFormPart)
                .isPresent();
    }

    @Override
    public boolean isUsedPage(Long formSeq) {
        return false;
    }

    @Override
    public Page<EditFormPartHist> findAllEditFormPartHistory(EditFormPartHistSearchDTO search) {
        return editFormPartHistRepository.findAll(search);
    }

    @Override
    public Optional<EditFormPartHist> findEditFormPartHistoryBySeq(Long seqNo) {
        return editFormPartHistRepository.findById(seqNo);
    }

    public Optional<EditFormPartHist> findEditFormPartLastHistory(EditFormPartHist editFormPartHist) {
        return editFormPartHistRepository.findLast(editFormPartHist);
    }

}
