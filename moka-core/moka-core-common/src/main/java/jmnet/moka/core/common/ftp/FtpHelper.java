package jmnet.moka.core.common.ftp;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;
import java.util.Optional;
import java.util.SortedMap;
import java.util.TreeMap;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.exception.ResourceNotFoundException;
import jmnet.moka.core.common.util.ResourceMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

/**
 * <pre>
 * Ftp 접속 Helper
 * Project : moka
 * Package : jmnet.moka.core.common.ftp
 * ClassName : FtpHelper
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 19:08
 */
@Slf4j
public class FtpHelper {

    //private Map<String, FtpInfo> ftpInfoMap;
    private SortedMap<String, GenericObjectPool<FTPClient>> ftpClientPoolMap;

    @Autowired
    public StringEncryptor mokaEncryptor;

    /**
     * ftp 설정 정보 파일
     */
    private final String RESOURCE_PATH = "ftp-info.json";

    public final static String IMAGES = "IMAGES";
    public final static String WIMAGE = "WIMAGE";
    public final static String STATIC = "STATIC";
    public final static String PDS = "PDS";


    /**
     * ftp_info.json에서 ftp 서버 접속 정보를 로드한다.
     */
    @PostConstruct
    private void init() {
        String SPRING_PROFILES_ACTIVE = System.getProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "");
        String resourcePath =
                McpString.isEmpty(SPRING_PROFILES_ACTIVE) ? RESOURCE_PATH : McpFile.addSuffix(RESOURCE_PATH, "-" + SPRING_PROFILES_ACTIVE);
        Resource resource = new ClassPathResource(resourcePath);
        try {
            File file = resource.getFile();
            if (file.exists()) {
                TypeReference<Map<String, FtpInfo>> typeRef = new TypeReference<>() {
                };

                Map<String, FtpInfo> ftpInfoMap = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(file, typeRef);
                ftpClientPoolMap = new TreeMap<>();
                if (this.mokaEncryptor != null) {
                    ftpInfoMap.forEach(this::accept);
                }
            }


        } catch (IOException io) {
            log.error("FtpHelper error => exception : {}", io.getMessage());
        }
    }


    /**
     * ftp sender 생성
     *
     * @param alias ftp 서버 별칭
     * @return GenericObjectPool
     */
    public GenericObjectPool<FTPClient> getFtpSender(String alias) {
        return ftpClientPoolMap.get(alias);
    }


    private void accept(String key, FtpInfo fi) {

        try {
            if (McpString.isNotEmpty(fi.getUser())) {
                fi.setUser(mokaEncryptor.decrypt(fi.getUser()));
            }
            if (McpString.isNotEmpty(fi.getPasswd())) {
                fi.setPasswd(mokaEncryptor.decrypt(fi.getPasswd()));
            }
            if (McpString.isNotEmpty(fi.getHost())) {
                fi.setHost(mokaEncryptor.decrypt(fi.getHost()));
            }
            if (McpString.isNotEmpty(fi.getPort())) {
                fi.setPort(mokaEncryptor.decrypt(fi.getPort()));
            }
        } catch (EncryptionOperationNotPossibleException ex) {
            log.error("FtpHelper error => exception : {}", ex.toString());
        }
        ftpClientPoolMap.put(key, new GenericObjectPool<>(new FtpClientFactory(fi)));
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param localFile 로컬 파일
     * @return 업로드 결과
     */
    public boolean upload(File localFile) {
        return upload(getFirstFtpInfoKey(), localFile, null, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param localFile  로컬 파일
     * @param remotePath ftp 저장 경로
     * @return 업로드 결과
     */
    public boolean upload(File localFile, String remotePath) {
        return upload(getFirstFtpInfoKey(), localFile, remotePath, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param fileName 로컬 파일 명
     * @param inStream 파일 stream
     * @return 업로드 결과
     */
    public boolean upload(String fileName, InputStream inStream) {
        return upload(getFirstFtpInfoKey(), fileName, inStream, null, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param fileName            로컬 파일 명
     * @param bufferedInputStream 파일 stream
     * @return 업로드 결과
     */
    public boolean upload(String fileName, BufferedInputStream bufferedInputStream) {
        return upload(getFirstFtpInfoKey(), fileName, bufferedInputStream, null, true);
    }

    private String getFirstFtpInfoKey() {
        return ftpClientPoolMap
                .keySet()
                .stream()
                .findFirst()
                .orElseThrow();
    }


    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key       FTP 프로퍼티 Key
     * @param localFile 로컬 파일
     * @return 업로드 결과
     */
    public boolean upload(String key, File localFile) {
        return upload(key, localFile, null, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key      FTP 프로퍼티 Key
     * @param fileName 로컬 파일 명
     * @param inStream 파일 stream
     * @return 업로드 결과
     */
    public boolean upload(String key, String fileName, InputStream inStream) {
        return upload(key, fileName, inStream, null, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key                 FTP 프로퍼티 Key
     * @param fileName            로컬 파일 명
     * @param bufferedInputStream 파일 stream
     * @return 업로드 결과
     */
    public boolean upload(String key, String fileName, BufferedInputStream bufferedInputStream) {
        return upload(key, fileName, bufferedInputStream, null, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key        FTP 프로퍼티 Key
     * @param localFile  로컬 파일
     * @param remotePath ftp 저장 경로
     * @return 업로드 결과
     */
    public boolean upload(String key, File localFile, String remotePath) {
        return upload(key, localFile, remotePath, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key        FTP 프로퍼티 Key
     * @param fileName   로컬 파일 명
     * @param inStream   파일 stream
     * @param remotePath ftp 저장 경로
     * @return 업로드 결과
     */
    public boolean upload(String key, String fileName, InputStream inStream, String remotePath) {
        return upload(key, fileName, inStream, remotePath, true);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key                 FTP 프로퍼티 Key
     * @param fileName            로컬 파일 명
     * @param bufferedInputStream 파일 stream
     * @param remotePath          ftp 저장 경로
     * @return 업로드 결과
     */
    public boolean upload(String key, String fileName, BufferedInputStream bufferedInputStream, String remotePath) {
        return upload(key, fileName, bufferedInputStream, remotePath, true);
    }


    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key        FTP 프로퍼티 Key
     * @param localFile  로컬 파일 명
     * @param remotePath ftp 저장 경로
     * @param isTempSave 임시 디렉토리에 미리 저장 한 후 파일 이동 처리 여부
     * @return 업로드 결과
     */
    public boolean upload(String key, File localFile, String remotePath, boolean isTempSave) {
        boolean success = false;
        try {
            BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(localFile));
            success = upload(key, localFile.getName(), bufferedInputStream, remotePath, isTempSave);
        } catch (FileNotFoundException e) {
            log.error("file not found!{}", localFile);
        }

        return success;
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key        FTP 프로퍼티 Key
     * @param inStream   파일 stream
     * @param remotePath ftp 저장 경로
     * @param isTempSave 임시 디렉토리에 미리 저장 한 후 파일 이동 처리 여부
     * @return 업로드 결과
     */
    public boolean upload(String key, String fileName, InputStream inStream, String remotePath, boolean isTempSave) {
        BufferedInputStream bufferedInputStream = new BufferedInputStream(inStream);
        return upload(key, fileName, bufferedInputStream, remotePath, isTempSave);
    }

    /**
     * 로컬 파일을 FTP 업로드 한다.
     *
     * @param key                 FTP 프로퍼티 Key
     * @param bufferedInputStream 파일 stream
     * @param remotePath          ftp 저장 경로
     * @param isTempSave          임시 디렉토리에 미리 저장 한 후 파일 이동 처리 여부
     * @return 업로드 결과
     */
    public boolean upload(String key, String fileName, BufferedInputStream bufferedInputStream, String remotePath, boolean isTempSave) {
        GenericObjectPool<FTPClient> ftpClientPool = ftpClientPoolMap.get(key);
        Optional
                .ofNullable(ftpClientPool)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_PATH, "ftp setting information", key));
        FtpInfo fi = ((FtpClientFactory) ftpClientPool.getFactory()).getFtpInfo();
        FTPClient ftpClient = null;

        boolean success = false;
        try {
            ftpClient = ftpClientPool.borrowObject();

            int replyCode = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(replyCode)) {
                log.warn("ftpServer refused connection, replyCode:{}", replyCode);
                return false;
            }
            StringBuilder realSavePath = new StringBuilder(fi.getRemotePath());
            if (McpString.isNotEmpty(remotePath)) {
                realSavePath
                        .append(realSavePath
                                .toString()
                                .endsWith(File.separator) ? "" : File.separator)
                        .append(remotePath);
            }

            String savePath = isTempSave ? fi.getTempPath() : realSavePath.toString();
            //ftpClient.makeDirectory(savePath);
            mkdirs(ftpClient, savePath);
            ftpClient.changeWorkingDirectory(savePath);

            for (int j = 0; j < fi.getRetry() && !success; j++) {
                success = ftpClient.storeFile(fileName, bufferedInputStream);
                if (success) {
                    log.info("upload file success! {}", fileName);
                } else {
                    log.warn("upload file failure! try uploading again... {} times", j);
                }
            }
            if (success && isTempSave) {
                // 파일 경로를 변경한다.
                //ftpClient.makeDirectory(realSavePath.toString());
                mkdirs(ftpClient, realSavePath.toString());
                success = ftpClient.rename(McpFile.makeFilepathName(fi.getTempPath(), fileName),
                        McpFile.makeFilepathName(realSavePath.toString(), fileName));
            }

        } catch (FileNotFoundException e) {
            log.error("file not found!{}", fileName);
        } catch (Exception e) {
            log.error("upload file failure!", e);
        } finally {
            IOUtils.closeQuietly(bufferedInputStream);
            ftpClientPool.returnObject(ftpClient);
        }

        return success;
    }

    /**
     * 파일 다운로드
     *
     * @param key       FTP 프로퍼티 Key
     * @param fileName  파일 명
     * @param localPath 로컬 저장 경로
     * @return 성공 여부
     */
    public boolean download(String key, String fileName, String localPath) {
        return download(key, null, fileName, localPath);
    }

    /**
     * 파일 다운로드
     *
     * @param key        FTP 프로퍼티 Key
     * @param remotePath ftp 파일 경로
     * @param fileName   파일 명
     * @param localPath  로컬 저장 경로
     * @return 성공 여부
     */
    public boolean download(String key, String remotePath, String fileName, String localPath) {
        FTPClient ftpClient = null;
        GenericObjectPool<FTPClient> ftpClientPool = ftpClientPoolMap.get(key);
        Optional
                .ofNullable(ftpClientPool)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_PATH, "ftp setting information", key));
        OutputStream outputStream = null;
        try {
            FtpInfo fi = ((FtpClientFactory) ftpClientPool.getFactory()).getFtpInfo();
            ftpClient = ftpClientPool.borrowObject();
            int replyCode = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(replyCode)) {
                log.warn("ftpServer refused connection, replyCode:{}", replyCode);
                return false;
            }

            McpFile.forceMkdir(new File(localPath));

            StringBuilder realPath = new StringBuilder(fi.getRemotePath());
            if (McpString.isNotEmpty(remotePath)) {
                realPath
                        .append(realPath
                                .toString()
                                .endsWith(File.separator) ? "" : File.separator)
                        .append(remotePath);
            }

            ftpClient.changeWorkingDirectory(realPath.toString());
            FTPFile[] ftpFiles = ftpClient.listFiles();
            for (FTPFile file : ftpFiles) {
                if (fileName.equalsIgnoreCase(file.getName())) {
                    String stringBuilder = localPath + File.separator + file.getName();
                    File localFile = new File(stringBuilder);
                    outputStream = new FileOutputStream(localFile);
                    ftpClient.retrieveFile(file.getName(), outputStream);
                }
            }
            ftpClient.logout();
            return true;
        } catch (Exception e) {
            log.error("download file failure!", e);
        } finally {
            IOUtils.closeQuietly(outputStream);
            ftpClientPool.returnObject(ftpClient);
        }
        return false;
    }

    /**
     * Ftp 파일 삭제 처리
     *
     * @param key      FTP 프로퍼티 Key
     * @param fileName 파일 명명
     * @return 삭제 결과
     */
    public boolean delete(String key, String fileName) {
        return delete(key, null, fileName);
    }

    /**
     * Ftp 파일 삭제 처리
     *
     * @param key        FTP 프로퍼티 Key
     * @param remotePath FTP 파 경로
     * @param fileName   파일 명명
     * @return 삭제 결과
     */
    public boolean delete(String key, String remotePath, String fileName) {
        FTPClient ftpClient = null;
        GenericObjectPool<FTPClient> ftpClientPool = ftpClientPoolMap.get(key);
        Optional
                .ofNullable(ftpClientPool)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_PATH, "ftp setting information", key));
        try {
            FtpInfo fi = ((FtpClientFactory) ftpClientPool.getFactory()).getFtpInfo();
            ftpClient = ftpClientPool.borrowObject();
            int replyCode = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(replyCode)) {
                log.warn("ftpServer refused connection, replyCode:{}", replyCode);
                return false;
            }
            StringBuilder realPath = new StringBuilder(fi.getRemotePath());
            if (McpString.isNotEmpty(remotePath)) {
                realPath
                        .append(realPath
                                .toString()
                                .endsWith(File.separator) ? "" : File.separator)
                        .append(remotePath);
            }
            ftpClient.changeWorkingDirectory(realPath.toString());
            int delCode = ftpClient.dele(fileName);
            log.debug("delete file reply code:{}", delCode);
            return true;
        } catch (Exception e) {
            log.error("delete file failure!", e);
        } finally {
            ftpClientPool.returnObject(ftpClient);
        }
        return false;
    }

    private void mkdirs(FTPClient ftpClient, String path)
            throws IOException {
        if (McpString.isNotEmpty(path)) {
            String[] paths = path.split(File.separator);
            String tempPath = "";
            for (String subPath : paths) {
                tempPath += "/" + subPath;
                if (ftpClient.changeWorkingDirectory(tempPath)) {
                    ftpClient.changeWorkingDirectory("/");
                } else {
                    ftpClient.makeDirectory(tempPath);
                }
            }
        }
    }


}
