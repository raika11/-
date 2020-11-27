package jmnet.moka.core.common.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;

/**
 * <pre>
 * Http Download 기능을 구현한다.
 * Project : moka
 * Package : jmnet.moka.core.common.util
 * ClassName : Downloader
 * Created : 2020-11-26 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-20 10:39
 */
@Slf4j
public class Downloader {

    public static void download(HttpServletResponse response, String contentType, String filePath)
            throws Exception {
        download(response, contentType, new File(filePath));
    }

    public static void download(HttpServletResponse response, String contentType, File file)
            throws Exception {
        BufferedOutputStream bos = null;
        try {
            if (file.exists()) {
                long fileSize = file.length();
                FileInputStream fileInputStream = null;
                try {
                    fileInputStream = new FileInputStream(file);
                    setFileDownloadHeader(response, contentType, file.getName());
                    response.setContentLength((int) fileSize);
                    bos = new BufferedOutputStream(response.getOutputStream());
                    int read;
                    byte buff[] = new byte[1024 * 10];
                    while ((read = fileInputStream.read(buff, 0, buff.length)) > 0) {
                        bos.write(buff, 0, read);
                    } // while
                } catch (IOException ex) {
                    log.error(ex.toString() + ", " + file.getName() + "[" + file.getName() + "]");
                } finally {
                    if (bos != null) {
                        bos.flush();
                        bos.close();
                    }
                    if (fileInputStream != null) {
                        fileInputStream.close();
                    }
                }
            }
        } catch (Exception ioe) {
            log.error("file download exception : {}", ioe.toString());
        } finally {
            if (bos != null) {
                bos.flush();
                bos.close();
            }
        }
    }

    public static void download(HttpServletResponse response, String contentType, String fileName, String data)
            throws Exception {
        download(response, contentType, fileName, data.getBytes(Charset.defaultCharset()));
    }

    public static void download(HttpServletResponse response, String contentType, String fileName, byte[] data)
            throws Exception {
        BufferedOutputStream bos = null;

        try {
            setFileDownloadHeader(response, contentType, fileName);
            bos = new BufferedOutputStream(response.getOutputStream());
            int read;
            bos.write(data);
        } finally {
            if (bos != null) {
                bos.flush();
                bos.close();
            }
        }
    }

    protected static HttpServletResponse setFileDownloadHeader(HttpServletResponse response, String contentType, String fileName) {
        response.setContentType(contentType);
        response.setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");
        response.setHeader(HttpHeaders.PRAGMA, "No-cache");
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-cache");
        response.setHeader(HttpHeaders.EXPIRES, "0");
        if (McpString.isNotEmpty(fileName)) {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < fileName.length(); i++) {
                char c = fileName.charAt(i);
                if (c > '~') {
                    sb.append(URLEncoder.encode("" + c, Charset.defaultCharset()));
                } else {
                    sb.append(c);
                }
            }
            String encodedFilename = sb.toString();
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"");
            response.setHeader(MokaConstants.HEADER_DOWNLOAD_FILENAME, encodedFilename);
        }
        return response;
    }
}
