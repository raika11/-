/**
 * msp-tps ReservedServiceImpl.java 2020. 6. 17. 오전 11:47:44 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import jmnet.moka.core.tps.mvc.reserved.repository.ReservedRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 6. 17. 오전 11:47:44
 */
@Service
@Slf4j
public class ReservedServiceImpl implements ReservedService {

    @Autowired
    private ReservedRepository reservedRepository;

    @Override
    public Page<Reserved> findAllReserved(ReservedSearchDTO search, Pageable pageable) {
        return reservedRepository.findList(search, pageable);
    }

    @Override
    public Optional<Reserved> findReservedBySeq(Long reservedSeq) {
        return reservedRepository.findById(reservedSeq);
    }

    @Override
    public Reserved insertReserved(Reserved reserved) {
        return reservedRepository.save(reserved);
    }

    @Override
    public Reserved updateReserved(Reserved reserved) {
        return reservedRepository.save(reserved);
    }

    @Override
    public void deleteReserved(Reserved reserved) {
        log.info("[DELETE Reserved] domainId : {} reservedSeq : {}", reserved.getDomain()
                                                                             .getDomainId(), reserved.getReservedSeq());

        reservedRepository.deleteById(reserved.getReservedSeq());
    }

    @Override
    public int countReservedByDomainId(String domainId) {
        return reservedRepository.countByDomain_DomainId(domainId);
    }
}
