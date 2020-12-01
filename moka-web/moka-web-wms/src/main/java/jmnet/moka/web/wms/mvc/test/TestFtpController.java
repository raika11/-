package jmnet.moka.web.wms.mvc.test;

import io.swagger.annotations.ApiOperation;
import jmnet.moka.core.common.ftp.FtpHelper;
import jmnet.moka.core.tps.exception.InvalidDataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 * ftp 테스트용 Controller
 * 납품시 삭제 필요
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.main.controller
 * ClassName : FtpTestController
 * Created : 2020-12-01 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-01 09:45
 */
@RestController
@RequestMapping("/api/test-ftp")
public class TestFtpController {
    /**
     * FtpHelper
     */
    @Autowired
    private FtpHelper ftpHelper;

    @ApiOperation(value = "이미지 업로드 - 테스트용 FTP 파일 업로드", tags = {"*** TEST FTP Upload ***"})
    @PostMapping("/upload/images")
    public ResponseEntity<?> imageUpload(MultipartFile file)
            throws InvalidDataException, Exception {

        boolean success = ftpHelper.upload(FtpHelper.IMAGES, file.getOriginalFilename(), file.getInputStream());

        return new ResponseEntity<>(success, HttpStatus.OK);

    }

    @ApiOperation(value = "PDS 업로드 - 테스트용 FTP 파일 업로드", tags = {"*** TEST FTP Upload ***"})
    @PostMapping("/upload/pds")
    public ResponseEntity<?> pdsUpload(MultipartFile file)
            throws InvalidDataException, Exception {

        boolean success = ftpHelper.upload(FtpHelper.PDS, file.getOriginalFilename(), file.getInputStream());

        return new ResponseEntity<>(success, HttpStatus.OK);

    }

    @ApiOperation(value = "static 업로드 - 테스트용 FTP 파일 업로드", tags = {"*** TEST FTP Upload ***"})
    @PostMapping("/upload/static")
    public ResponseEntity<?> staticUpload(MultipartFile file)
            throws InvalidDataException, Exception {

        boolean success = ftpHelper.upload(FtpHelper.STATIC, file.getOriginalFilename(), file.getInputStream());

        return new ResponseEntity<>(success, HttpStatus.OK);

    }

    @ApiOperation(value = "W이미지 업로드 - 테스트용 FTP 파일 업로드", tags = {"*** TEST FTP Upload ***"})
    @PostMapping("/upload/wimage")
    public ResponseEntity<?> wimageUpload(MultipartFile file)
            throws InvalidDataException, Exception {

        boolean success = ftpHelper.upload(FtpHelper.WIMAGE, file.getOriginalFilename(), file.getInputStream());

        return new ResponseEntity<>(success, HttpStatus.OK);

    }
}
