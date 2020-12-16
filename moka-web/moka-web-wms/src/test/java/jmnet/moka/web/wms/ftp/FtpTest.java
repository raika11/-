package jmnet.moka.web.wms.ftp;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ftp.FtpHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
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

        ftpHelper.upload(FtpHelper.IMAGES, new File("/server.log"));

        ftpHelper.upload(FtpHelper.WIMAGE, new File("/vcredist.bmp"), "/text");
    }

    /**
     * 다운로드 테스트
     *
     * @throws Exception 예외 처리
     */
    @Test
    public void ftpDownloadTest()
            throws Exception {

        ftpHelper.download(FtpHelper.IMAGES, "server.log", "/download");

    }

    /**
     * 삭제 테스트
     *
     * @throws Exception 예외 처리
     */
    @Test
    public void ftpDeleteTest()
            throws Exception {

        ftpHelper.delete(FtpHelper.IMAGES, "server.log");

    }



    @Test
    public void getDomain()
            throws IOException {

        Set<String> domainList = new LinkedHashSet<>();

        String path = "C:\\box\\static\\newsStand\\Joongang_v4.html";
        String html = FileUtils.readFileToString(new File(path), "UTF-8");

        Pattern pattern1 = Pattern.compile("<a href=\\\"(?<entry>.*?)\\\"", Pattern.CASE_INSENSITIVE);
        Pattern pattern2 = Pattern.compile("src=\\\"(?<entry>.*?)\\\"", Pattern.CASE_INSENSITIVE);
        Pattern pattern3 = Pattern.compile("src='(?<entry>.*?)'", Pattern.CASE_INSENSITIVE);

        Matcher matcher1 = pattern1.matcher(html);
        String url = "";
        while (matcher1.find()) {
            url = matcher1.group(1);
            if (!url.equals("#") && McpString.isNotEmpty(url)) {
                if (!url.startsWith("http") && !url.startsWith("https")) {
                    url = "http:" + url;
                }
                URL netUrl = new URL(url);
                String host = netUrl.getHost();
                if (McpString.isNotEmpty(host)) {
                    domainList.add(host);
                }
            }
        }


    }

}
