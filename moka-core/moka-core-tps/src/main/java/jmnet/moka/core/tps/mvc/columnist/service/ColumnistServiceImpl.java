/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.service;

import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import jmnet.moka.core.tps.mvc.columnist.repository.ColumnistRepository;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
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
public class ColumnistServiceImpl implements ColumnistService {

    @Autowired
    private ColumnistRepository columnistRepository;

    @Autowired
    private UploadFileHelper uploadFileHelper;

    @Override
    public Page<Columnist> findAllColumnist(ColumnistSearchDTO search) {
        return columnistRepository.findAllColumnist(search);
    }

    @Override
    public Optional<Columnist> findById(Long seqNo) {
        return columnistRepository.findById(seqNo);
    }

    @Override
    public Columnist updateColumnist(Columnist columnist) {
        return columnistRepository.save(columnist);
    }

    @Override
    public Columnist insertColumnist(Columnist columnist) {
//        if (McpString.isEmpty(columnist.getseqNo())) {
//            Columnist.setseqNo(getNewDirectseqNo());
//        }
        return columnistRepository.save(columnist);
    }

    @Override
    public boolean isDuplicatedId(Long seqNo) {
        Optional<Columnist> existingColumnist = this.findById(seqNo);
        return existingColumnist.isPresent();
    }

    @Override
    public String saveImage(Columnist columnist, MultipartFile thumbnail)
            throws Exception {
        String extension = McpFile.getExtension(thumbnail.getOriginalFilename()).toLowerCase();
        String newFilename = String.valueOf(columnist.getSeqNo()) + "." + extension;
        // 이미지를 저장할 실제 경로 생성
        //String imageRealPath = uploadFileHelper.getRealPath(TpsConstants.DIRECT_LINK_BUSINESS, "/news/search_direct_link/", newFilename);
        String uri = "https://pds.joins.com/news/search_direct_link/";

        try {
            if (uploadFileHelper.saveImage("c:/msp/wms/", thumbnail.getBytes())) {
                //String uri = uploadFileHelper.getDbUri(TpsConstants.DIRECT_LINK_BUSINESS, "/news/search_direct_link/", newFilename);
                uri= uri + newFilename;

            }
        } catch (Exception e) {
            return "https://pds.joins.com/news/search_direct_link/" + newFilename;
        }

        return uri;
    }

    @Override
    public boolean deleteImage(Columnist columnist)
            throws Exception {
        // 이미지 실제 경로 생성
        String imageRealPath = uploadFileHelper.getRealPathByDB(columnist.getProfilePhoto());
        return uploadFileHelper.deleteFile(imageRealPath);
    }

}
