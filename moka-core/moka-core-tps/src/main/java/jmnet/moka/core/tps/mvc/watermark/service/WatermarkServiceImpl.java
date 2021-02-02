package jmnet.moka.core.tps.mvc.watermark.service;

import java.util.List;
import java.util.Optional;

import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import jmnet.moka.core.tps.mvc.watermark.repository.WatermarkRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.watermark.service
 * ClassName : WatermarkServiceImpl
 * Created : 2021-01-21 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-21 13:41
 */

@Service
@Slf4j
public class WatermarkServiceImpl implements WatermarkService {

    @Autowired
    private FtpHelper ftpHelper;

    @Value("${pds.url}")
    private String pdsUrl;

    /////////////////////////////////////////////
    //임시 파일 저장 경로 설정
    //@Value("${direct-link.save.filepath}")
    private String saveFilePath = "/moka_storage/watermark";

    @Autowired
    private WatermarkRepository watermarkRepository;

    @Override
    public List<Watermark> findAllWatermark() {
        return watermarkRepository.findAllByUsedYn(MokaConstants.YES);
    }

    @Override
    public Page<Watermark> findAllWatermark(WatermarkSearchDTO search) {
        return watermarkRepository.findAllWatermark(search);
    }

    @Override
    public Optional<Watermark> findById(Long seqNo) {
        return watermarkRepository.findById(seqNo);
    }

    @Override
    public boolean isDuplicatedId(Long seqNo) {
        Optional<Watermark> existingWatermark = this.findById(seqNo);
        return existingWatermark.isPresent();
    }

    @Override
    @Transactional
    public Watermark insertWatermark(Watermark watermark) {
        return watermarkRepository.save(watermark);
    }

    @Override
    @Transactional
    public Watermark updateWatermark(Watermark watermark) {
        return watermarkRepository.save(watermark);
    }

    @Override
    public String saveImage(Watermark watermark, MultipartFile thumbnail)
            throws Exception {

        // 파일명 생성
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();
        String fileName = String.valueOf(watermark.getSeqNo()) + "." + extension;

        saveFilePath = saveFilePath.replace("/" + watermark.getSourceCode(),"");
        saveFilePath = "/moka_storage/watermark" + "/" + watermark.getSourceCode();

        // 파일 저장
        boolean upload = ftpHelper.upload(FtpHelper.PDS, fileName, thumbnail.getInputStream(), saveFilePath);

        if (upload) {
            log.debug("SAVE Watermark IMAGE");
            String path = pdsUrl + saveFilePath + "/" + fileName;
            return path;
        } else {
            log.debug("SAVE FAIL Watermark IMAGE");
        }

        return "";
    }
    @Override
    public void deleteWatermark(Watermark watermark) {
        watermarkRepository.delete(watermark);
    }

    @Override
    public boolean deleteImage(Watermark watermark)
            throws Exception {
        String extension = McpFile
                .getExtension(watermark.getImgUrl())
                .toLowerCase();
        String fileName = String.valueOf(watermark.getSeqNo()) + "." + extension;

        return ftpHelper.delete(FtpHelper.PDS, saveFilePath, fileName);
    }


}
