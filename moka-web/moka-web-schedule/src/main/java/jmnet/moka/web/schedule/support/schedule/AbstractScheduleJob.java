package jmnet.moka.web.schedule.support.schedule;

import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.net.MalformedServerReplyException;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

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

    /**
     * 외부 API URL 호출용
     */
    @Autowired
    protected RestTemplateHelper restTemplateHelper;

    @Autowired
    private MokaCrypt mokaCrypt;

    protected GenContent scheduleInfo;



    /**
     * 초기화
     *
     * @param info schedule job 정보
     */
    protected void init(GenContent info) {
        scheduleInfo = info;
    }

    /**
     * 마무리 처리
     */
    public void finish() {
        // todo 1. 처리 결과 TB_GEN_STATUS 테이블에 update 등 마무리 처리
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
     * rss 문자열을 받아 ftp 서버로 전송한다.
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
        log.debug("before rss upload : {}", scheduleInfo.getCallUrl());
        log.debug("before rss upload : {}", scheduleInfo.getFtpPassive());
        log.debug("before rss upload : {}", scheduleInfo.getFtpPort());


        if(scheduleInfo.getSendType() != null && scheduleInfo.getSendType().equals("FTP")){
            testFtp(rss);
        }


        log.debug("after rss upload");


        return false;
    }

    private void testFtp(String rss){

        try{
            FTPClient ftpClient = new FTPClient();
            //Passive Mode (ftp서버가 기본포트가 아닌 경우)
            if(scheduleInfo.getFtpPassive() != null && scheduleInfo.getFtpPassive().equals("Y")){
                ftpClient.connect(scheduleInfo.getCallUrl(), Math.toIntExact(scheduleInfo.getFtpPort()));
            }
            else{
                ftpClient.connect(scheduleInfo.getCallUrl());
            }

            //FTP 연결성공
            if(FTPReply.isPositiveCompletion(ftpClient.getReplyCode())){
                boolean loginResponse = ftpClient.login(scheduleInfo.getGenTarget().getAccessId(), mokaCrypt.decrypt(scheduleInfo.getGenTarget().getAccessPwd()));
                log.debug("ftp login : {}", loginResponse);

                ftpClient.changeWorkingDirectory(scheduleInfo.getTargetPath());

                boolean logoutResponse = ftpClient.logout();
                log.debug("ftp logout : {}", logoutResponse);

                ftpClient.disconnect();
            }
            //FTP 연결실패
            else{
                ftpClient.disconnect();
                log.error("ftp connect failed : {}", scheduleInfo.getCallUrl());
            }

        }catch (Exception e){
            log.error("ftp error : {}", e);
        }
    }
}
