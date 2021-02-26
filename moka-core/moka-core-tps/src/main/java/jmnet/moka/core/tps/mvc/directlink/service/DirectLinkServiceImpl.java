/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.directlink.service;

import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.directlink.repository.DirectLinkRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private FtpHelper ftpHelper;

    @Value("${pds.url}")
    private String pdsUrl;

    @Value("${direct-link.save.filepath}")
    private String saveFilePath;

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
        directLink.setModDt(McpDate.now());
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

        // 파일명 생성
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();
        String fileName = String.valueOf(directLink.getLinkSeq()) + "." + extension;

        // 파일 저장
        boolean upload = ftpHelper.upload(FtpHelper.PDS, fileName, thumbnail.getInputStream(), saveFilePath);
        if (upload) {
            log.debug("SAVE DIRECT_LINK IMAGE");
            String path = pdsUrl + saveFilePath + "/" + fileName;
            return path;
        } else {
            log.debug("SAVE FAIL DIRECT_LINK IMAGE");
        }

        return "";
    }

    @Override
    public boolean deleteImage(DirectLink directLink)
            throws Exception {
        String extension = McpFile
                .getExtension(directLink.getImgUrl())
                .toLowerCase();
        String fileName = String.valueOf(directLink.getLinkSeq()) + "." + extension;

        return ftpHelper.delete(FtpHelper.PDS, saveFilePath, fileName);
    }

}
