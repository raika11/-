package jmnet.moka.web.rcv.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import jmnet.moka.web.rcv.config.FtpConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.util
 * ClassName : FtpUtil
 * Created : 2020-11-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-04 004 오후 6:10
 */

@Slf4j
public class FtpUtil {
    public static boolean uploadFle(FtpConfig ftpConfig, String sourceFile, String uploadPath, String uploadFileName) {
        return uploadFle(ftpConfig, Collections.singletonList(sourceFile), Collections.singletonList(uploadPath),
                Collections.singletonList(uploadFileName));
    }

    public static boolean uploadFle(FtpConfig ftpConfig, List<String> sourceFileList, List<String> uploadPathList,
            List<String> uploadFileNameList) {
        final int count = Math.min(sourceFileList.size(), Math.min(uploadPathList.size(), uploadFileNameList.size()));
        if (count == 0) {
            return true;
        }

        FTPClient ftp = new FTPClient();
        try {
            ftp.setControlEncoding("UTF-8");
            ftp.connect(ftpConfig.getIp(), ftpConfig.getPort());
            if (!ftp.login(ftpConfig.getUser(), ftpConfig.getPassword())) {
                log.error("ftp 로그인 실패 {}:{} id={}", ftpConfig.getIp(), ftpConfig.getPort(), ftpConfig.getUser());
                return false;
            }
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
            ftp.setFileTransferMode(FTP.BINARY_FILE_TYPE);
            if (ftpConfig.getPassive() > 0) {
                ftp.enterLocalPassiveMode();
            }

            for (int i = 0; i < count; i++) {
                if (!changeAndMakeDirecotry(ftp, Paths
                        .get(ftpConfig.getRootDir(), uploadPathList.get(i))
                        .toString()
                        .replace('\\', '/'))) {
                    return false;
                }

                InputStream inputStream = null;
                boolean success;
                final String tmpFileName = uploadFileNameList
                        .get(i)
                        .concat(".tmp");

                try {
                    inputStream = new FileInputStream(new File(sourceFileList.get(i)));
                    success = ftp.storeFile(tmpFileName, inputStream);
                    inputStream.close();
                    inputStream = null;

                    if (checkFileExists(ftp, uploadFileNameList.get(i))) {
                        ftp.deleteFile(uploadFileNameList.get(i));
                    }
                } catch (Exception e) {
                    log.error("ftp upload file [{}] 실패 {} ", uploadFileNameList.get(i), e);
                    return false;
                } finally {
                    try {
                        if (inputStream != null) {
                            inputStream.close();
                        }
                    } catch (Exception e) {
                        // no
                    }
                }

                if (!success) {
                    log.error("ftp upload file [{}] 실패 ", uploadFileNameList.get(i));
                    return false;
                } else {
                    if (!ftp.rename(tmpFileName, uploadFileNameList.get(i))) {
                        log.info("ftp rename [{}] 실패 1 ", uploadFileNameList.get(i));
                        if (checkFileExists(ftp, tmpFileName)) {
                            if (!ftp.rename(tmpFileName, uploadFileNameList.get(i))) {
                                log.info("ftp rename [{}] 실패 2 ", uploadFileNameList.get(i));
                                if (checkFileExists(ftp, tmpFileName)) {
                                    if (!ftp.rename(tmpFileName, uploadFileNameList.get(i))) {
                                        log.error("ftp rename [{}] 실패 3 ", uploadFileNameList.get(i));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            log.error("ftp upload file 실패 {}", e.getMessage());
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (ftp.isConnected()) {
                    ftp.logout();
                    ftp.disconnect();
                }
            } catch (IOException ex) {
                // no
            }
        }

        return true;
    }

    private static boolean checkFileExists(FTPClient ftp, String filePath) {
        try {
            return ftp.listFiles(filePath).length > 0;
        } catch (IOException e) {
            return false;
        }
    }

    private static boolean changeAndMakeDirecotry(FTPClient ftp, String workDir)
            throws IOException {
        if (ftp.changeWorkingDirectory(workDir)) {
            return true;
        }

        String[] paths = workDir.split("/");
        String childDir = "";
        for (String path : paths) {
            childDir += "/" + path;

            if (!ftp.changeWorkingDirectory(childDir)) {
                ftp.makeDirectory(childDir);
                if (!ftp.changeWorkingDirectory(childDir)) {
                    return false;
                }
            }
        }
        return true;
    }
}
