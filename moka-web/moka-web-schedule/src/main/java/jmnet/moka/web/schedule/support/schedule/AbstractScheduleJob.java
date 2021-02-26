package jmnet.moka.web.schedule.support.schedule;

import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.gen.repository.GenStatusRepository;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.mvc.gen.service.GenStatusService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.util.Date;

/**
 * <pre>
 * Schedule Job 공통 기능
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.schedule
 * ClassName : AbstractScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
@Slf4j
public abstract class AbstractScheduleJob implements ScheduleJob {
    private static final Logger logger = LoggerFactory.getLogger(AbstractScheduleJob.class);

    /**
     * DB 처리용
     */
    @Autowired
    protected GenContentService jobContentService;

    @Autowired
    protected GenStatusService jobStatusService;

    @Autowired
    private GenStatusRepository genStatusRepository;

    /**
     * 외부 API URL 호출용
     */
    @Autowired
    protected RestTemplateHelper restTemplateHelper;

    @Autowired
    private MokaCrypt mokaCrypt;

    protected GenContent scheduleInfo;

    protected GenStatus scheduleResult;



    /**
     * 초기화
     *
     * @param info schedule job 정보
     */
    protected void init(GenContent info) {
        scheduleInfo = info;

        //info에 해당하는 genStatus가 없는 경우 생성
        scheduleResult = info.getGenStatus();
        if(scheduleResult == null){
            scheduleResult = jobStatusService.insertGenStatus(info.getJobSeq());
        }
    }

    /**
     * 마무리 처리
     */
    public void finish() {
        // todo 1. 처리 결과 TB_GEN_STATUS 테이블에 update 등 마무리 처리

        //현재 genResult + lastExecdt 만 입력 중
        scheduleResult.setLastExecDt(new Date());
        scheduleResult = jobStatusService.updateGenStatus(scheduleResult);

        log.debug("finish : {}", scheduleResult.getGenResult());
    }

    /**
     * finish()에서 처리할 스케줄 실행 결과 값 입력
     */
    protected void setFinish(boolean success){
        if(success){
            //schedule 실행 결과가 성공
            scheduleResult.setGenResult(200L);
        }
        else{
            //schedule 실행 결과가 실패
            scheduleResult.setSendResult(500L);
        }
    }

    @Override
    public void doTask(GenContent info) {
        init(info);
        try {
            invoke();
        } catch (Exception ex) {
            logger.error("schedule invoke error ", ex);
        } finally {
            finish();
        }

    }

    /**
     * 각 Job별 기능 구현
     */
    public abstract void invoke();

    /**
     * rss 문자열을 받아 ftp 서버 / nd 로 전송한다.
     *
     * @param rss
     * @return
     */
    protected boolean rssFileUpload(String rss) {
        /**
         * todo 2. ftp 또는 NAS에 파일 저장하는 기능 구현 필요
         * 1. sendType을 통해 ftp인지 네트워크 드라이브인지 판단
         * 2. ftp 접속 정보 : GetTarget 클래스 이용
         * 3. 저장 경로 : scheduleInfo 객체의 targetPath 속성 값
         */

        log.debug("before rss upload : {}", scheduleInfo.getJobSeq());
        log.debug("before rss upload : {}", scheduleInfo.getSendType());
        log.debug("before rss upload : {}", scheduleInfo.getGenTarget().getServerIp());
        log.debug("before rss upload : {}", scheduleInfo.getFtpPassive());
        log.debug("before rss upload : {}", scheduleInfo.getFtpPort());
        log.debug("before rss upload : {}", scheduleInfo.getTargetPath());
        log.debug("before rss upload : {}", scheduleInfo.getTargetFileName());

        boolean result = false;

        if(scheduleInfo.getSendType() != null && scheduleInfo.getSendType().equals("FTP")){
            result = uploadFtpString(rss);
        }

        return result;
    }


    /**
     * rss 문자열을 받아 파일 생성 + FTP 서버에 업로드실행
     *
     * @param rss
     * @return true/false
     */
    private boolean uploadFtpString(String rss){
        FileWriter fw = null;
        BufferedWriter bw = null;
        FileInputStream fis = null;

        try{
            FTPClient ftpClient = new FTPClient();
            //Passive Mode (ftp서버가 기본포트가 아닌 경우)
            if(scheduleInfo.getFtpPassive() != null && scheduleInfo.getFtpPassive().equals("Y")){
                ftpClient.connect(scheduleInfo.getGenTarget().getServerIp(), Math.toIntExact(scheduleInfo.getFtpPort()));
                ftpClient.enterLocalPassiveMode();
            }
            else{
                ftpClient.connect(scheduleInfo.getGenTarget().getServerIp());
            }

            //FTP 연결성공
            if(FTPReply.isPositiveCompletion(ftpClient.getReplyCode())){
                //FTP 로그인
                boolean loginResponse = ftpClient.login(scheduleInfo.getGenTarget().getAccessId(),
                        mokaCrypt.decrypt(scheduleInfo.getGenTarget().getAccessPwd()));
                log.debug("ftp login : {}", loginResponse);

                ftpClient.changeWorkingDirectory(scheduleInfo.getTargetPath());
                ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

                //현재 임시파일 저장공간 지정이 없는 관계로 현재 패키지 위치에서 생성/삭제
                String tempPath = AbstractScheduleJob.class.getResource("").getPath();
                File tempFile = File.createTempFile("temp",".rss", new File(tempPath));
                //File tempFile = File.createTempFile("test",".rss", new File("c:\\Temp"));

                //임시파일에 RSS 스트링 데이터 입력
                fw = new FileWriter(tempFile);
                bw = new BufferedWriter(fw);
                bw.write(rss);
                bw.flush();

                bw.close();
                fw.close();

                //임시파일을 FTP에 업로드
                fis = new FileInputStream(tempFile);
                boolean uploadResponse = ftpClient.storeFile(scheduleInfo.getTargetFileName(), fis);
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


                //FTP 업로드 실패 시
                if(!uploadResponse){
                    return false;
                }

            }
            //FTP 연결실패
            else{
                ftpClient.disconnect();
                log.error("ftp connect failed : {}", scheduleInfo.getGenTarget().getServerIp());
                return false;
            }

        }
        catch (Exception e){
            log.error("uploadFtpString error : {}", e);
            return false;
        }
        finally{
            close(bw);
            close(fw);
            close(fis);
        }

        return true;
    }

    public static void close(Closeable c){
        if(c == null){
            return;
        }

        try{
            c.close();
        }
        catch (IOException e) {
            log.error("ftp file error : {}", e);
        }
    }
}
