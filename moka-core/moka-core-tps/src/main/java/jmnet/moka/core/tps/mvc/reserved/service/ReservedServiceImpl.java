/**
 * msp-tps ReservedServiceImpl.java 2020. 6. 17. 오전 11:47:44 ssc
 */
package jmnet.moka.core.tps.mvc.reserved.service;

import java.util.Optional;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import jmnet.moka.core.tps.mvc.reserved.dto.ReservedSearchDTO;
import jmnet.moka.core.tps.mvc.reserved.entity.Reserved;
import jmnet.moka.core.tps.mvc.reserved.repository.ReservedRepository;

/**
 * <pre>
 * 
 * 2020. 6. 17. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 6. 17. 오전 11:47:44
 * @author ssc
 */
@Service
@Slf4j
public class ReservedServiceImpl implements ReservedService {

    @Autowired
    private ReservedRepository reservedRepository;

    @Override
    public Page<Reserved> findList(ReservedSearchDTO search, Pageable pageable) {
        return reservedRepository.findList(search, pageable);
    }

    @Override
    public Optional<Reserved> findByReservedSeq(Long reservedSeq) {
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
    public void deleteReserved(Reserved reserved, String name) {
        log.info("[DELETE Reserved] domainId : {} reservedSeq : {}",
                reserved.getDomain().getDomainId(), reserved.getReservedSeq());

        reservedRepository.deleteById(reserved.getReservedSeq());
    }

    @Override
    public int countByDomainId(String domainId) {
        return reservedRepository.countByDomain_DomainId(domainId);
    }
}
