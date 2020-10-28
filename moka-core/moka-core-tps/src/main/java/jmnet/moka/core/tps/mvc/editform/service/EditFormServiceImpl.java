package jmnet.moka.core.tps.mvc.editform.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormHist;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormHistRepository;
import jmnet.moka.core.tps.mvc.editform.repository.EditFormRepository;
import org.springframework.data.domain.Page;
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
@Service
public class EditFormServiceImpl implements EditFormService {

    private final EditFormRepository editFormRepository;

    private final EditFormHistRepository editFormHistRepository;

    public EditFormServiceImpl(EditFormRepository editFormRepository, EditFormHistRepository editFormHistRepository) {
        this.editFormRepository = editFormRepository;
        this.editFormHistRepository = editFormHistRepository;
    }


    @Override
    public Page<EditForm> findAllEditForm(SearchDTO search) {
        return editFormRepository.findAll(search.getPageable());
    }

    @Override
    public List<EditForm> findAllEditForm() {
        return editFormRepository.findAll();
    }

    @Override
    public Optional<EditForm> findEditForm(EditForm editForm) {
        return editFormRepository.findEditForm(editForm);
    }

    @Override
    public EditForm insertEditForm(EditForm editForm)
            throws Exception {
        editForm = editFormRepository.save(editForm);
        if (editForm.getEditFormSeq() > 0) {
            editFormHistRepository.save(EditFormHist
                    .builder()
                    .editFormSeq(editForm.getEditFormSeq())
                    .formData(editForm.getFormData())
                    .build());
        }
        return editForm;
    }

    @Override
    public EditForm updateEditForm(EditForm editForm) {
        editForm = editFormRepository.save(editForm);
        editFormHistRepository.save(EditFormHist
                .builder()
                .editFormSeq(editForm.getEditFormSeq())
                .formData(editForm.getFormData())
                .build());
        return null;
    }

    @Override
    public void deleteEditFormById(String editFormId)
            throws Exception {

    }

    @Override
    public void deleteEditForm(EditForm editForm)
            throws Exception {

    }

    @Override
    public boolean isDuplicatedId(EditForm editForm) {
        return editFormRepository
                .findEditForm(editForm)
                .isPresent();
    }

    @Override
    public boolean isUsedPage(Long editFormSeq) {
        return false;
    }

}
