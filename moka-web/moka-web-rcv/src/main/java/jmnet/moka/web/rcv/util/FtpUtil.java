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
    public static boolean uploadFle(FtpConfig pdsFtpConfig, String sourceFile, String uploadPath, String uploadFileName) {
        return uploadFle(pdsFtpConfig, Collections.singletonList(sourceFile), Collections.singletonList(uploadPath),
                Collections.singletonList(uploadFileName));
    }

    public static boolean uploadFle(FtpConfig pdsFtpConfig, List<String> sourceFileList, List<String> uploadPathList,
            List<String> uploadFileNameList) {
        final int count = Math.min(sourceFileList.size(), Math.min(uploadPathList.size(), uploadFileNameList.size()));
        if (count == 0) {
            return true;
        }

        FTPClient ftp = new FTPClient();
        try {
            ftp.setControlEncoding("UTF-8");
            ftp.connect(pdsFtpConfig.getIp(), pdsFtpConfig.getPort());
            if (!ftp.login(pdsFtpConfig.getUser(), pdsFtpConfig.getPassword())) {
                log.error("ftp 로그인 실패 {}:{} id={}", pdsFtpConfig.getIp(), pdsFtpConfig.getPort(), pdsFtpConfig.getUser());
                return false;
            }
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
            ftp.setFileTransferMode(FTP.BINARY_FILE_TYPE);
            if (pdsFtpConfig.getPassive() > 0) {
                ftp.enterLocalPassiveMode();
            }

            for (int i = 0; i < count; i++) {
                if (!changeAndMakeDirecotry(ftp, Paths
                        .get(pdsFtpConfig.getRootDir(), uploadPathList.get(i))
                        .toString()
                        .replace('\\', '/'))) {
                    return false;
                }

                InputStream inputStream = null;
                boolean success = false;
                final String tmpFileName = uploadFileNameList
                        .get(i)
                        .concat(".tmp");

                try {
                    inputStream = new FileInputStream(new File(sourceFileList.get(i)));
                    success = ftp.storeFile(tmpFileName, inputStream);
                    inputStream.close();

                    if (checkFileExists(ftp, uploadFileNameList.get(i))) {
                        ftp.deleteFile(uploadFileNameList.get(i));
                    }
                } catch (Exception e) {
                    log.error("ftp upload file [{}] 실패 {} ", uploadFileNameList.get(i), e);
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
