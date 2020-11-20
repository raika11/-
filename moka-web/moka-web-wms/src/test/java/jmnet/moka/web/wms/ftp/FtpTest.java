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

    @Autowired
    private FtpHelper ftpHelper;

    @Test
    public void ftpUploadTest()
            throws Exception {

        ftpHelper.uploadFile(FtpHelper.MEDIA, new File("/server.log"));

        ftpHelper.uploadFile(FtpHelper.HOME, new File("/vcredist.bmp"), "/text");
    }



}
