package jmnet.moka.web.schedule.support.system;

import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.support.StatusFlagType;
import jmnet.moka.web.schedule.support.reserve.AbstractReserveJob;
import jmnet.moka.web.schedule.support.schedule.AbstractScheduleJob;
import lombok.extern.slf4j.Slf4j;
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

    public boolean runInstantJob(GenContent info) {

        if (info
                .getJobType()
                .equals("S")) {
            return runScheduleJob(info);
        } else if (info
                .getJobType()
                .equals("R")) {
            return runReserveJob(info);
        }

        return false;
    }

    private boolean runScheduleJob(GenContent info) {
        boolean result = false;
        try {
            AbstractScheduleJob job = (AbstractScheduleJob) context.getBean(Class.forName(info.getProgrameNm()));
            job.doTask(info);

            //실행결과가 성공
            if (info
                    .getGenStatus()
                    .getGenResult() == 200L) {
                result = true;
            }

        } catch (Exception e) {
            log.error("InstantJobHandler > runScheduleJob fail :{}", e);
        }

        return result;
    }

    private boolean runReserveJob(GenContent info) {
        boolean result = false;
        try {
            //조회된 history가 없다면 실행실패
            GenContentHistory history = jobContentService
                    .findGenContentHistory(info.getJobSeq())
                    .orElseThrow();
            log.debug("history seqNo : " + history.getSeqNo());
            log.debug("history GenStatus jobSeq : " + history
                    .getGenContent()
                    .getGenStatus()
                    .getJobSeq());

            AbstractReserveJob job = (AbstractReserveJob) context.getBean(Class.forName(info.getProgrameNm()));
            //info에 해당하는 history를 사용하여 asyncTask 대신 invoke 직접 실행
            history = job.invoke(history);
            //작업결과로 finish 직접 실행
            job.finish(history);

            //실행결과가 성공
            if (history.getStatus() == StatusFlagType.DONE) {
                result = true;
            }

        } catch (Exception e) {
            log.error("InstantJobHandler > runReserveJob fail :{}", e);
        }

        return result;
    }
}