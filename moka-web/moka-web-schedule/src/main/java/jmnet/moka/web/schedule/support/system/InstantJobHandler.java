package jmnet.moka.web.schedule.support.system;

import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.support.StatusFlagType;
import jmnet.moka.web.schedule.support.reserve.AbstractReserveJob;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * InstantJob
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.reserve
 * ClassName : ReserveJobHandler
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 14:59
 */
@Component
@Slf4j
public class InstantJobHandler {

    @Autowired
    private GenContentService jobContentService;

    @Autowired
    private ApplicationContext context;

    public boolean runInstantJob(GenContent info){

        if(info.getJobType().equals("S")){
            return runScheduleJob(info);
        }
        else if(info.getJobType().equals("R")){
            return runReserveJob(info);
        }

        return false;
    }

    private boolean runScheduleJob(GenContent info){
        boolean result = false;
        try{
            AbstractScheduleJob job = (AbstractScheduleJob) context.getBean(Class.forName(info.getProgrameNm()));
            job.doTask(info);
            GenStatus scheduleResult = job.getFinish();

            //실행결과가 성공
            if(scheduleResult.getGenResult() == 200L){
                return true;
            }

        }catch (BeansException | ClassNotFoundException e) {
            log.error("InstantJobHandler > runScheduleJob fail :{}", e);
        }

        return result;
    }

    private boolean runReserveJob(GenContent info){
        boolean result = false;
        try{
            GenContentHistory history = jobContentService
                    .findGenContentHistoryById(info.getJobSeq())
                    .orElseThrow();
            AbstractReserveJob job = (AbstractReserveJob) context.getBean(Class.forName(info.getProgrameNm()));
            history = job.invoke(history);

            //실행결과가 성공
            if(history.getStatus() == StatusFlagType.DONE){
                result = true;
            }
            //ReserveJob 실행 후 history를 갱신해야하면 history update 추가필요

        }catch (BeansException | ClassNotFoundException e) {
            log.error("InstantJobHandler > runReserveJob fail :{}", e);
        }

        return result;
    }
}