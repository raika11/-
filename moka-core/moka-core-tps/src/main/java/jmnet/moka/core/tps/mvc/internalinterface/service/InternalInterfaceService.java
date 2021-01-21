package jmnet.moka.core.tps.mvc.internalinterface.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.internalinterface.dto.InternalInterfaceSearchDTO;
import jmnet.moka.core.tps.mvc.internalinterface.entity.InternalInterface;
import org.springframework.data.domain.Page;

/**
 * <pre>
 * 내부 시스템 API관리 Service
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.internalinterface.service
 * ClassName : InternalInterfaceService
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 09:55
 */
public interface InternalInterfaceService {

    Page<InternalInterface> findAllInternalInterface(InternalInterfaceSearchDTO searchDTO);

    Optional<InternalInterface> findInternalInterfaceBySeq(Long seqNo);

    InternalInterface insertInternalInterface(InternalInterface internalInterface);

    InternalInterface updateInternalInterface(InternalInterface internalInterface);

    InternalInterface deleteInternalInterface(InternalInterface internalInterface);
}
