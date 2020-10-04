package jmnet.moka.core.tps.mvc.template.controller;

import java.io.File;
import java.nio.file.Files;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.UploadFileHelper;

@Controller
@Slf4j
@RequestMapping("/image/template")
public class TemplateImageRestController {
    @Autowired
    private UploadFileHelper fileHelper;

    /**
     * 도메인이 있는 템플릿의 이미지 서비스
     * @param request HTTP 요청
     * @param domainId 도메인ID
     * @param templateThumbnail 템플릿 썸네일
     * @return 이미지 byte[]
     * @throws NoDataException 데이터없음
     */
    @GetMapping(value = "{domainId:\\d+}/{templateThumbnail:\\d+\\.(?:jpe*g|JPE*G|png|PNG|gif|GIF)}",
            produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    public ResponseEntity<byte[]> getImageAsResponseEntity(HttpServletRequest request,
            @PathVariable("domainId") String domainId,
            @PathVariable("templateThumbnail") String templateThumbnail) throws NoDataException {
        
        String imgRealPath = fileHelper.getRealPath("template", domainId, templateThumbnail);
        HttpHeaders headers = new HttpHeaders();
        
        try {
            File file = new File(imgRealPath);
            byte[] media = Files.readAllBytes(file.toPath());
            headers.setCacheControl(CacheControl.noCache().getHeaderValue());
             
            ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(media, headers, HttpStatus.OK);
            return responseEntity;
        } catch(Exception e) {
            log.debug("[FAIL TO FILE LOAD] {}", imgRealPath);
            e.printStackTrace();
        }
        
        return null;
    }
    
    /**
     * 공통 도메인 템플릿 이미지 서비스
     * @param request HTTP 요청
     * @param templateThumbnail 템플릿 썸네일
     * @return 이미지 byte[]
     * @throws NoDataException 데이터없음
     */
    @GetMapping(value = "{templateThumbnail:\\d+\\.(?:jpe*g|JPE*G|png|PNG|gif|GIF)}",
        produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
    public ResponseEntity<byte[]> getCommonDomainImageAsResponseEntity(HttpServletRequest request,
            @PathVariable("templateThumbnail") String templateThumbnail) throws NoDataException {
        
        String imgRealPath = fileHelper.getRealPath("template", templateThumbnail);
        HttpHeaders headers = new HttpHeaders();
        
        try {
            File file = new File(imgRealPath);
            byte[] media = Files.readAllBytes(file.toPath());
            headers.setCacheControl(CacheControl.noCache().getHeaderValue());
             
            ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(media, headers, HttpStatus.OK);
            return responseEntity;
        } catch(Exception e) {
            log.debug("[FAIL TO FILE LOAD] {}", imgRealPath);
            e.printStackTrace();
        }
        
        return null;
    }
}
