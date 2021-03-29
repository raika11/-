package jmnet.moka.web.schedule.support.common;

import java.io.BufferedWriter;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;


/**
 * <pre>
 * 공용기능 > 파일업로드
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.common
 * ClassName : FileUpload
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-25
 */
@Slf4j
public class FileUpload {

    private MokaCrypt mokaCrypt;

    private GenContent genContent;

    public FileUpload(GenContent genContent, MokaCrypt mokaCrypt) {
        this.genContent = genContent;
        this.mokaCrypt = mokaCrypt;
    }

    /**
     * 문자열을 받아 ftp 서버 / nd 로 전송한다.
     *
     * @param rss
     * @return
     */
    public boolean stringFileUpload(String rss, String filename)
            throws Exception {
        /**
         * todo 2. ftp 또는 NAS에 파일 저장하는 기능 구현 필요
         * 1. sendType을 통해 ftp인지 네트워크 드라이브인지 판단
         * 2. ftp 접속 정보 : GetTarget 클래스 이용
         * 3. 저장 경로 : scheduleInfo 객체의 targetPath 속성 값
         */

        log.debug("before FileUpload : {}", genContent.getJobSeq());
        log.debug("before FileUpload : {}", genContent.getSendType());
        log.debug("before FileUpload : {}", genContent
                .getGenTarget()
                .getServerIp());
        log.debug("before FileUpload : {}", genContent.getFtpPassive());
        log.debug("before FileUpload : {}", genContent.getFtpPort());
        log.debug("before FileUpload : {}", genContent.getTargetPath());
        log.debug("before FileUpload : {}", filename);
        log.debug("before FileUpload : {}", genContent.getTargetFileName());

        boolean result = false;

        //FTP
        if (genContent.getSendType() != null && genContent
                .getSendType()
                .equals("FTP")) {
            result = uploadFtpString(rss, filename);
        }

        return result;
    }


    /**
     * 문자열을 받아 파일 생성 + FTP 서버에 업로드실행
     *
     * @param content
     * @return true/false
     */
    private boolean uploadFtpString(String content, String filename)
            throws Exception {
        FileWriter fw = null;
        BufferedWriter bw = null;
        FileInputStream fis = null;

        try {
            FTPClient ftpClient = new FTPClient();
            //Passive Mode (ftp서버가 기본포트가 아닌 경우)
            if (genContent.getFtpPassive() != null && genContent
                    .getFtpPassive()
                    .equals("Y")) {
                ftpClient.connect(genContent
                        .getGenTarget()
                        .getServerIp(), Math.toIntExact(genContent.getFtpPort()));
                ftpClient.enterLocalPassiveMode();
            } else {
                ftpClient.connect(genContent
                        .getGenTarget()
                        .getServerIp());
            }

            //FTP 연결성공
            if (FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
                //FTP 로그인
                boolean loginResponse = ftpClient.login(genContent
                        .getGenTarget()
                        .getAccessId(), mokaCrypt.decrypt(genContent
                        .getGenTarget()
                        .getAccessPwd()));
                log.debug("ftp login : {}", loginResponse);

                //업로드 위치 설정
                ftpClient.changeWorkingDirectory(genContent.getTargetPath());
                ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

                //현재 임시파일 저장공간 지정이 없는 관계로 현재 패키지 위치에서 생성/삭제
                String tempPath = AbstractScheduleJob.class
                        .getResource("")
                        .getPath();
                File tempFile = File.createTempFile("temp", ".txt", new File(tempPath));
                //File tempFile = File.createTempFile("test",".rss", new File("c:\\Temp"));

                //임시파일에 스트링 데이터 입력
                fw = new FileWriter(tempFile);
                bw = new BufferedWriter(fw);
                bw.write(content);
                bw.flush();

                bw.close();
                fw.close();

                //파일명이 전달되지 않은 경우 > genContent의 기본파일명 사용
                String uploadFileName = filename;
                log.debug("McpString.isEmpty(uploadFileName) : {}", McpString.isEmpty(uploadFileName));
                if (McpString.isEmpty(uploadFileName)) {
                    uploadFileName = genContent.getTargetFileName();
                }

                //설정된 파일 명으로 임시파일을 FTP에 업로드
                fis = new FileInputStream(tempFile);
                boolean uploadResponse = ftpClient.storeFile(uploadFileName, fis);
                log.debug("ftp upload : {}", uploadResponse);

                fis.close();


                //FTP 로그아웃
                boolean logoutResponse = ftpClient.logout();
                log.debug("ftp logout : {}", logoutResponse);

                //FTP 접속종료
                ftpClient.disconnect();

                //임시파일 삭제
                boolean deleteResponse = tempFile.delete();
                log.debug("ftp delete tempFile : {}", deleteResponse);


                if (!loginResponse) {
                    throw new MokaException("FTP 로그인이 실패했습니다.");
                } else if (!uploadResponse) {
                    throw new MokaException("FTP 업로드가 실패했습니다.");
                }

            }
            //FTP 연결실패
            else {
                ftpClient.disconnect();
                log.error("ftp connect failed : {}", genContent
                        .getGenTarget()
                        .getServerIp());
                throw new MokaException("FTP 연결이 실패했습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            log.error("uploadFtpString error : {}", e.getMessage());
            throw e;
        } finally {
            close(bw);
            close(fw);
            close(fis);
        }

        return true;
    }

    public static void close(Closeable c) {
        if (c == null) {
            return;
        }

        try {
            c.close();
        } catch (IOException e) {
            log.error("ftp file error : {}", e);
        }
    }
}
