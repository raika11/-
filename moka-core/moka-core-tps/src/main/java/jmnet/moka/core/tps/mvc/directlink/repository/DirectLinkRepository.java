/**
 * msp-tps DomainInfoRepository.java 2020. 1. 8. 오후 2:04:49 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.repository;

import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.group.repository.GroupRepositorySupport;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * <pre>
 * 기자관리 Repository
 * 2020. 11. 10. ssc 최초생성
 * </pre>
 * 
 * 2020. 11. 10. 오후 2:04:49
 * @author ssc
 */
@Repository
public interface DirectLinkRepository extends JpaRepository<DirectLink, Long>, JpaSpecificationExecutor<DirectLink>, DirectLinkRepositorySupport {

    public Long countByLinkSeq(Long linkSeq);

    Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO search);
}