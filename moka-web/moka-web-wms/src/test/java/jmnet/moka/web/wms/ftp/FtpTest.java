package jmnet.moka.web.wms.ftp;

import java.io.File;
import jmnet.moka.core.common.ftp.FtpHelper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * <pre>
 * ftp upload 테스트
 * Project : moka
 * Package : jmnet.moka.web.wms.util
 * ClassName : FtpTest
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 09:02
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Slf4j
public class FtpTest {

    /**
     * FtpHelper
     */
    @Autowired
    private FtpHelper ftpHelper;

    /**
     * 업로드 테스트
     *
     * @throws Exception 예외 처리
     */
    @Test
    public void ftpUploadTest()
            throws Exception {

        ftpHelper.upload(FtpHelper.MEDIA, new File("/server.log"));

        ftpHelper.upload(FtpHelper.HOME, new File("/vcredist.bmp"), "/text");
    }

    /**
     * 다운로드 테스트
     *
     * @throws Exception 예외 처리
     */
    @Test
    public void ftpDownloadTest()
            throws Exception {

        ftpHelper.download(FtpHelper.MEDIA, "server.log", "/download");

    }

    /**
     * 삭제 테스트
     *
     * @throws Exception 예외 처리
     */
    @Test
    public void ftpDeleteTest()
            throws Exception {

        ftpHelper.delete(FtpHelper.MEDIA, "server.log");

    }



}
