package jmnet.moka.core.tps.mvc.internalinterface.service;

import java.util.Optional;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.internalinterface.dto.InternalInterfaceSearchDTO;
import jmnet.moka.core.tps.mvc.internalinterface.entity.InternalInterface;
import jmnet.moka.core.tps.mvc.internalinterface.repository.InternalInterfaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 * 내부 시스템 API관리 Service Implementation class
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.internalinterface.service
 * ClassName : InternalInterfaceServiceImpl
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 09:55
 */
@Service
public class InternalInterfaceServiceImpl implements InternalInterfaceService {

    @Autowired
    private InternalInterfaceRepository internalInterfaceRepository;

    @Override
    public Page<InternalInterface> findAllInternalInterface(InternalInterfaceSearchDTO searchDTO) {
        return internalInterfaceRepository.findAllInternalInterface(searchDTO);
    }

    @Override
    public Optional<InternalInterface> findInternalInterfaceBySeq(Long seqNo) {
        return internalInterfaceRepository.findBySeqNoAndDelYn(seqNo, MokaConstants.NO);
    }

    @Override
    public InternalInterface insertInternalInterface(InternalInterface internalInterface) {
        return internalInterfaceRepository.save(internalInterface);
    }

    @Override
    public InternalInterface updateInternalInterface(InternalInterface internalInterface) {
        return internalInterfaceRepository.save(internalInterface);
    }

    @Override
    public InternalInterface deleteInternalInterface(InternalInterface internalInterface) {
        internalInterface.setDelYn(MokaConstants.YES);
        return internalInterfaceRepository.save(internalInterface);
    }
}
