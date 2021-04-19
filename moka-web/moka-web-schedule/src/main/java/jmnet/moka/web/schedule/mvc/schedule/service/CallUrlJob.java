package jmnet.moka.web.schedule.mvc.schedule.service;

import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.support.StatusResultType;
import jmnet.moka.web.schedule.support.common.FileUpload;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * <pre>
 * 타 시스템을 URL로 호출하여 파일을 생성
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : CallUrlJob
 * </pre>
 *
 * @author 유영제
 * @since 2021-04-16
 */

@Slf4j
@Component
public class CallUrlJob extends AbstractScheduleJob {

    @Override
    public void invoke(GenContent info) {
        GenContent scheduleInfo = info;
        GenStatus scheduleResult = info.getGenStatus();

        try {
            ResponseEntity<String> res = restTemplateHelper.get(scheduleInfo.getCallUrl());
            if(res.getStatusCodeValue() == StatusResultType.SUCCESS.getCode()) {
                String callUrlReponse = res.getBody();
                scheduleResult.setSendExecTime((new Date()).getTime());

                FileUpload fileUpload = new FileUpload(scheduleInfo, mokaCrypt);
                boolean success = fileUpload.stringFileUpload(callUrlReponse, scheduleInfo.getTargetFileName());

                if (success) {
                    scheduleResult.setContent(callUrlReponse);
                    scheduleResult.setSendResult(StatusResultType.SUCCESS.getCode());
                    scheduleResult.setSendExecTime(((new Date()).getTime() - scheduleResult.getSendExecTime()) / 1000);
                } else {
                    scheduleResult.setSendResult(StatusResultType.FAILED.getCode());
                    scheduleResult.setSendExecTime(0l);
                }

                setFinish(success, info);
            }
            else
            {
                scheduleResult.setSendResult(StatusResultType.FAILED.getCode());
                scheduleResult.setSendResult(0l);
                scheduleResult.setSendExecTime(0l);
            }
        }
        catch(Exception e)
        {
            //e.printStackTrace();
            log.error(e.toString());
            scheduleResult.setSendExecTime(0l);
            setFinish(StatusResultType.FAILED_JOB, e.getMessage(), scheduleInfo);
        }
    }
}
