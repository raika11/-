package jmnet.moka.web.bulk.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.List;
import jmnet.moka.web.bulk.common.vo.TotalVo;
import jmnet.moka.web.bulk.config.FtpConfig;
import jmnet.moka.web.bulk.task.bulkdump.vo.BulkDumpJobVo;
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

public class BulkFtpUtil {
    public static boolean uploadFle(TotalVo<BulkDumpJobVo> totalVo, String cpName, FtpConfig ftpConfig, List<String> sourceFileList, List<String> uploadPathList,
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
                totalVo.logError("ftp 로그인 실패 {}:{} id={}", ftpConfig.getIp(), ftpConfig.getPort(), ftpConfig.getUser());
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

                    if (checkFileExists(ftp, uploadFileNameList.get(i))) {
                        ftp.deleteFile(uploadFileNameList.get(i));
                    }
                    if( success )
                        totalVo.logInfo("ftp upload file {} [{}]->[{} {}] 성공 ", cpName, sourceFileList.get(i), ftpConfig.getRootDir(), uploadFileNameList.get(i));
                } catch (Exception e) {
                    totalVo.logError("ftp upload file {} [{}]->[{} {}] 실패 {}", cpName, sourceFileList.get(i), ftpConfig.getRootDir(), uploadFileNameList.get(i), e.getMessage());
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
                    totalVo.logError("ftp upload file {} [{}]->[{} {}] 실패 {}", cpName, sourceFileList.get(i), ftpConfig.getRootDir(), uploadFileNameList.get(i), ftp.getReplyString());
                    return false;
                } else {
                    if (!ftp.rename(tmpFileName, uploadFileNameList.get(i))) {
                        totalVo.logInfo("ftp rename [{}] 실패 1 ", uploadFileNameList.get(i));
                        if (checkFileExists(ftp, tmpFileName)) {
                            if (!ftp.rename(tmpFileName, uploadFileNameList.get(i))) {
                                totalVo.logInfo("ftp rename [{}] 실패 2 ", uploadFileNameList.get(i));
                                if (checkFileExists(ftp, tmpFileName)) {
                                    if (!ftp.rename(tmpFileName, uploadFileNameList.get(i))) {
                                        totalVo.logError("ftp rename [{}] 실패 3 ", uploadFileNameList.get(i));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            totalVo.logError("ftp upload file 실패 {}", e.getMessage());
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
