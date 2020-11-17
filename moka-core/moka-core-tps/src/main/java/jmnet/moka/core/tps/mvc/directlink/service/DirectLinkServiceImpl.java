/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.service;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.directlink.repository.DirectLinkRepository;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 기자관리 서비스 2020. 11. 11. ssc 최초생성
 *
 * @author ssc
 * @since 2020. 11. 11. 오후 2:07:40
 */
@Service
@Slf4j
public class DirectLinkServiceImpl implements DirectLinkService {

    @Autowired
    private DirectLinkRepository directLinkRepository;

    @Override
    public Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO search) {
        return directLinkRepository.findAllDirectLink(search);
    }

    @Override
    public Optional<DirectLink> findById(String linkSeq) {
        return directLinkRepository.findById(linkSeq);

    }

    @Override
    public DirectLink updateDirectLink(DirectLink directLink) {
        return directLinkRepository.save(directLink);
    }

    @Override
    public DirectLink insertDirectLink(DirectLink directLink) {
        if (McpString.isEmpty(directLink.getLinkSeq())) {
            directLink.setLinkSeq(getNewDirectLinkSeq());
        }
        return directLinkRepository.save(directLink);
    }

    @Override
    public boolean isDuplicatedId(String linkSeq) {
        Optional<DirectLink> existingDirectLink = this.findById(linkSeq);
        return existingDirectLink.isPresent();
    }

    @Override
    public boolean hasMembers(String linkSeq) {
        return directLinkRepository.countByLinkSeq(linkSeq) > 0 ? true : false;
    }

    @Override
    public void deleteDirectLink(DirectLink directLink) {
        directLinkRepository.delete(directLink);
    }

    private String getNewDirectLinkSeq() {
        long count = directLinkRepository.count();
        String newId = String.format("%s%02d", "DIRECT_LINK_PREFIX", count + 1);
        return newId;
    }
}
