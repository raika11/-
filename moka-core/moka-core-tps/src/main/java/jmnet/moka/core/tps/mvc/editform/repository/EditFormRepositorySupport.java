package jmnet.moka.core.tps.mvc.editform.repository;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.editform.entity.EditForm;

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
public interface EditFormRepositorySupport {
    public Optional<EditForm> findEditForm(EditForm editForm);
}
