/**
 * msp-tps DomainServiceImpl.java 2020. 1. 8. 오후 2:07:40 ssc
 */
package jmnet.moka.core.tps.mvc.columnist.service;

import java.util.Optional;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.UUIDGenerator;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.mvc.columnist.dto.ColumnistSearchDTO;
import jmnet.moka.core.tps.mvc.columnist.entity.Columnist;
import jmnet.moka.core.tps.mvc.columnist.repository.ColumnistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private FtpHelper ftpHelper;

    @Value("${pds.url}")
    private String pdsUrl;

    @Value("${columnist.save.filepath}")
    private String saveFilePath;

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
        // 파일명 생성
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();

        String filename = UUIDGenerator.uuid() + "." + extension;

        // 파일 저장
        boolean upload = ftpHelper.upload(FtpHelper.PDS, filename, thumbnail.getInputStream(), saveFilePath);
        if (upload) {
            log.debug("SAVE COLUMNIST IMAGE");
            String path = pdsUrl + saveFilePath + "/" + filename;
            return path;
        } else {
            log.debug("SAVE FAIL COLUMNIST IMAGE");
        }

        return "";
    }

    @Override
    public boolean deleteImage(Columnist columnist)
            throws Exception {
        String extension = McpFile
                .getExtension(columnist.getProfilePhoto())
                .toLowerCase();
        String fileName = String.valueOf(columnist.getSeqNo()) + "." + extension;

        return ftpHelper.delete(FtpHelper.PDS, saveFilePath, fileName);
    }

}
