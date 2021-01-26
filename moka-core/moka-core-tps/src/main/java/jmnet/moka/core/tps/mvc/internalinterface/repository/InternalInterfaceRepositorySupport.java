package jmnet.moka.core.tps.mvc.internalinterface.repository;

import jmnet.moka.core.tps.mvc.internalinterface.dto.InternalInterfaceSearchDTO;
import jmnet.moka.core.tps.mvc.internalinterface.entity.InternalInterface;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.internalinterface.repository
 * ClassName : InternalInterfaceRepositorySupport
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 10:23
 */
public interface InternalInterfaceRepositorySupport {

    Page<InternalInterface> findAllInternalInterface(InternalInterfaceSearchDTO searchDTO);
}
