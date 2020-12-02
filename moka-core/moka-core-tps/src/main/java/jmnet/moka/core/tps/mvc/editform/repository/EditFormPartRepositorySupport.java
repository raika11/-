package jmnet.moka.core.tps.mvc.editform.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartSearchDTO;
import jmnet.moka.core.tps.mvc.editform.entity.EditFormPart;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editform.repository
 * ClassName : MenuRepositorySupport
 * Created : 2020-10-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-23 09:38
 */
public interface EditFormPartRepositorySupport {
    Page<EditFormPart> findAll(EditFormPartSearchDTO searchDTO);

    public Optional<EditFormPart> findEditFormPart(EditFormPart editFormPart);
}
