/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import jmnet.moka.core.tps.mvc.special.repository.SpecialPageMgtRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 설명
 *
 * @author ohtah
 * @since 2020. 12. 6.
 */
@Service
@Slf4j
public class SpecialPageMgtServiceImpl implements SpecialPageMgtService {
    @Autowired
    private SpecialPageMgtRepository specialPageMgtRepository;

    @Autowired
    private FtpHelper ftpHelper;

    @Value("${pds.url}")
    private String pdsUrl;

    @Override
    public Page<SpecialPageMgt> findAllSpecialPageMgt(SpecialPageMgtSearchDTO search) {
        return specialPageMgtRepository.findAllSpecialPageMgt(search);
    }

    @Override
    public Optional<SpecialPageMgt> findSpecialPageMgtBySeq(Long seqNo) {
        return specialPageMgtRepository.findById(seqNo);
    }

    @Override
    public SpecialPageMgt insertSpecialPageMgt(SpecialPageMgt specialPageMgt) {
        return specialPageMgtRepository.save(specialPageMgt);
    }

    @Override
    public SpecialPageMgt updateSpecialPageMgt(SpecialPageMgt specialPageMgt) {
        return specialPageMgtRepository.save(specialPageMgt);
    }

    @Override
    public String saveImage(MultipartFile thumbnail)
            throws IOException {

        // 파일명 생성
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();
        String uuid = UUID
                .randomUUID()
                .toString();
        String fileName = uuid + "." + extension;

        // 경로 생성
        // https://stg-pds.joongang.co.kr/special/thumbnail/
        String remotePath = "/" + String.join("/", "special", "thumbnail");

        // 파일 저장
        boolean upload = ftpHelper.upload(FtpHelper.PDS, fileName, thumbnail.getInputStream(), remotePath);
        if (upload) {
            log.debug("SAVE SPECIAL_PAGE_MGT THUMBNAIL");
            String path = pdsUrl + remotePath + "/" + fileName;
            return path;
        } else {
            log.debug("SAVE FAIL SPECIAL_PAGE_MGT THUMBNAIL");
        }

        return "";
    }

    @Override
    public void deleteSpecialPageMgt(SpecialPageMgt specialPageMgt) {
        specialPageMgt.setUsedYn(MokaConstants.DELETE);
        specialPageMgtRepository.save(specialPageMgt);
    }

    @Override
    public List<String> findAllDeptBySpecialPageMgt() {
        return specialPageMgtRepository.findAllDeptName();
    }
}
