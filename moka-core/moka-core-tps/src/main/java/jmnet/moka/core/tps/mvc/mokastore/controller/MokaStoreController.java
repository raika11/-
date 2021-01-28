/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mokastore.controller;

import io.swagger.annotations.Api;
import java.io.File;
import java.nio.file.Files;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Description: 파일서비스 컨트롤러
 *
 * @author ssc
 * @since 2020-10-20
 */
@Controller
@Slf4j
@RequestMapping("/moka_storage")
@Api(tags = {"파일서비스 API"})
public class MokaStoreController {

    @Autowired
    private UploadFileHelper uploadFileHelper;

    /**
     * 파일 서비스
     *
     * @param request HTTP 요청
     * @return 이미지 byte[]
     * @throws NoDataException 데이터없음
     */
    @GetMapping(value = "/{business}/{domainId:\\d+}/{filename:\\d+\\.(?:jpe*g|JPE*G|png|PNG|gif|GIF)}", produces = {MediaType.IMAGE_JPEG_VALUE,
                                                                                                                     MediaType.IMAGE_PNG_VALUE,
                                                                                                                     MediaType.IMAGE_GIF_VALUE})
    public ResponseEntity<byte[]> getImageAsResponseEntity(HttpServletRequest request, @PathVariable("business") String business,
            @PathVariable("domainId") String domainId, @PathVariable("filename") String filename)
            throws NoDataException {
        String imgRealPath = null;
        if (business.equals(TpsConstants.TEMPLATE_BUSINESS)) {
            imgRealPath = uploadFileHelper.getRealPath(TpsConstants.TEMPLATE_BUSINESS, domainId, filename);
        }

        if (McpString.isEmpty(imgRealPath)) {
            log.debug("[NO FILE PATH] {}", request.getRequestURI());
        } else {
            try {
                File file = new File(imgRealPath);
                byte[] media = Files.readAllBytes(file.toPath());
                HttpHeaders headers = new HttpHeaders();
                headers.setCacheControl(CacheControl
                        .noCache()
                        .getHeaderValue());

                ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(media, headers, HttpStatus.OK);
                return responseEntity;
            } catch (Exception e) {
                log.debug("[FAIL TO FILE LOAD] {}", imgRealPath);
            }
        }
        return null;
    }
}
