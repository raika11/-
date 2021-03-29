package jmnet.moka.web.schedule.support.schedule;

import java.util.Date;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.encrypt.MokaCrypt;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.mvc.gen.service.GenStatusService;
import jmnet.moka.web.schedule.support.StatusResultType;
import lombok.extern.slf4j.Slf4j;
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

    @Autowired
    protected GenStatusService jobStatusService;

    /**
     * 외부 API URL 호출용
     */
    @Autowired
    protected RestTemplateHelper restTemplateHelper;

    @Autowired
    protected MokaCrypt mokaCrypt;


    //같은 클래스가 스케쥴러에 등록된 경우 전역변수를 공유하는 문제로 인해 전역변수를 삭제하고
    //init/invoke/finish에서 잡등록에 포함된 info로 대체하여 실행
    //protected GenContent scheduleInfo;
    //protected GenStatus scheduleResult;



    /**
     * 초기화
     *
     * @param info schedule job 정보
     */
    protected void init(GenContent info) {
        //info에 해당하는 GenStatus가 없는 경우 생성(작업시작 전 작업실패 상태)
        GenStatus scheduleResult = info.getGenStatus();
        if (scheduleResult == null) {
            info.setGenStatus(jobStatusService.insertGenStatusInit(info.getJobSeq()));
        }
        //GenStatus가 존재하는 경우 작업시작 전 작업실패 상태로 갱신 (에러발생 시 shutdown 되는 경우로 인해 완료 시 성공처리)
        else {
            scheduleResult.setGenResult(StatusResultType.BEFORE_EXECUTE.getCode());
            scheduleResult.setErrMgs(StatusResultType.BEFORE_EXECUTE.getName());
            scheduleResult.setLastExecDt(new Date());
            jobStatusService.updateGenStatus(scheduleResult);
        }
    }

    /**
     * 마무리 처리
     */

    public void finish(GenContent info) {
        GenStatus scheduleResult = info.getGenStatus();

        scheduleResult.setLastExecDt(new Date());
        scheduleResult = jobStatusService.updateGenStatus(scheduleResult);

        log.debug("{} finish : {}", scheduleResult.getJobSeq(), scheduleResult.getGenResult());

    }

    /**
     * finish()에서 처리할 스케줄 실행 결과 값 입력 각 작업 별 invoke()에서 작업 완료 후 호출 필요
     */
    protected void setFinish(boolean success, GenContent info) {
        if (success) {
            setFinish(StatusResultType.SUCCESS, StatusResultType.SUCCESS.getName(), info);
        }
    }

    /**
     * finish()에서 처리할 스케줄 실행 결과 값 입력 각 작업 별 invoke()에서 작업 실패 시 호출 필요
     */
    protected void setFinish(StatusResultType statusResultType, String errorMsg, GenContent info) {
        //schedule 실행 결과가 성공
        if (statusResultType == StatusResultType.SUCCESS) {
            info
                    .getGenStatus()
                    .setGenResult(StatusResultType.SUCCESS.getCode());
            info
                    .getGenStatus()
                    .setErrMgs(StatusResultType.SUCCESS.getName());
        }
        //schedule 실행 결과가 실패
        else {
            info
                    .getGenStatus()
                    .setGenResult(statusResultType.getCode());
            if (McpString.isNotEmpty(errorMsg)) {
                //전달된 에러 메시지가 존재하는 경우
                info
                        .getGenStatus()
                        .setErrMgs(errorMsg);
            } else {
                //에러 메시지가 없는 경우 statusResultType에 해당 하는 메시지 입력
                info
                        .getGenStatus()
                        .setErrMgs(statusResultType.getName());
            }

        }
    }

    @Override
    public void doTask(GenContent info) {
        init(info);
        try {
            invoke(info);
        } catch (Exception ex) {
            ex.printStackTrace();
            logger.error("schedule invoke error ", ex);
            setFinish(StatusResultType.FAILED, ex.getMessage(), info);
        } finally {
            finish(info);
        }

    }

    /**
     * 각 Job별 기능 구현
     */
    public abstract void invoke(GenContent info);

}
