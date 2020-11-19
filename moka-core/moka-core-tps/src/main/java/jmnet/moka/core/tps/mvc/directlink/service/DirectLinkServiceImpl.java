/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.service;

import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.directlink.repository.DirectLinkRepository;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import jmnet.moka.core.tps.mvc.template.entity.Template;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    private UploadFileHelper uploadFileHelper;

    @Override
    public Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO search) {
        return directLinkRepository.findAllDirectLink(search);
    }

    @Override
    public Optional<DirectLink> findById(Long linkSeq) {
        return directLinkRepository.findById(linkSeq);

    }

    @Override
    @Transactional
    public DirectLink updateDirectLink(DirectLink directLink) {
        return directLinkRepository.save(directLink);
    }

    @Override
    @Transactional
    public DirectLink insertDirectLink(DirectLink directLink) {
//        if (McpString.isEmpty(directLink.getLinkSeq())) {
//            directLink.setLinkSeq(getNewDirectLinkSeq());
//        }
        return directLinkRepository.save(directLink);
    }

    @Override
    public boolean isDuplicatedId(Long linkSeq) {
        Optional<DirectLink> existingDirectLink = this.findById(linkSeq);
        return existingDirectLink.isPresent();
    }

    @Override
    public boolean hasMembers(Long linkSeq) {
        return directLinkRepository.countByLinkSeq(linkSeq) > 0 ? true : false;
    }

    @Override
    public void deleteDirectLink(DirectLink directLink) {
        directLinkRepository.delete(directLink);
    }

//    private Long getNewDirectLinkSeq() {
//        long count = directLinkRepository.count();
//        Long newId = count + 1;
//        return newId;
//    }

    @Override
    public String saveImage(DirectLink directLink, MultipartFile thumbnail)
            throws Exception {
        String extension = McpFile.getExtension(thumbnail.getOriginalFilename()).toLowerCase();
        String newFilename = String.valueOf(directLink.getLinkSeq()) + "." + extension;
        // 이미지를 저장할 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPath(TpsConstants.DIRECT_LINK_BUSINESS, "/news/search_direct_link/", newFilename);

        if (uploadFileHelper.saveImage(imageRealPath, thumbnail.getBytes())) {
            String uri = uploadFileHelper.getDbUri(TpsConstants.DIRECT_LINK_BUSINESS, "/news/search_direct_link/", newFilename);
            return uri;
        } else {
            return "";
        }
    }

    @Override
    public boolean deleteImage(DirectLink directLink)
            throws Exception {
        // 이미지 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPathByDB(directLink.getImgUrl());
        return uploadFileHelper.deleteFile(imageRealPath);
    }

}
