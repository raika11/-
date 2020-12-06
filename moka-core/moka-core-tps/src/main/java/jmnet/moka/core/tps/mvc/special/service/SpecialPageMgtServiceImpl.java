/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtDTO;
import jmnet.moka.core.tps.mvc.special.dto.SpecialPageMgtSearchDTO;
import jmnet.moka.core.tps.mvc.special.entity.SpecialPageMgt;
import jmnet.moka.core.tps.mvc.special.repository.SpecialPageMgtRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
public class SpecialPageMgtServiceImpl implements SpecialPageMgtService {
    @Autowired
    private SpecialPageMgtRepository specialPageMgtRepository;

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
    public String saveImage(SpecialPageMgt specialPageMgt, MultipartFile thumbnail) {

        // 파일명 생성
        String extension = McpFile
                .getExtension(thumbnail.getOriginalFilename())
                .toLowerCase();
        String fileName = specialPageMgt.getSeqNo().toString() + "." + extension;

        return "";
    }

    @Override
    public void deleteSpecialPageMgt(SpecialPageMgt specialPageMgt) {
        specialPageMgtRepository.deleteById(specialPageMgt.getSeqNo());
    }
}
