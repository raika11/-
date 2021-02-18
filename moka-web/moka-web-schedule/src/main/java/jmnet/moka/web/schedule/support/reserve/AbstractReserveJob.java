package jmnet.moka.web.schedule.support.reserve;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatusHistory;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.mvc.reserve.dto.ReserveJobDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

/**
 * <pre>
 * 예약 Job 공통 기능
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.schedule
 * ClassName : AbstractScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
public abstract class AbstractReserveJob implements ReserveJob {
    private static final Logger logger = LoggerFactory.getLogger(AbstractReserveJob.class);

    protected GenStatusHistory scheduleHistory;

    @Autowired
    protected GenContentService jobContentService;

    @Autowired
    private RestTemplateHelper restTemplateHelper;

    protected String success;
    protected StringBuffer scheduleDesc;

    /**
     * 초기화
     */
    protected void init() {

    }

    /**
     * 마무리 처리
     */
    public void finish(Long taskSeq) {
        // todo 1. 처리 결과 TB_GEN_STATUS 테이블에 update 등 마무리 처리

        //실행 완료 시 상태변경 후 저장
        scheduleHistory.setStatus("1");
        scheduleHistory.setEndDt(new Date());
        jobContentService.updateGenStatusHistory(scheduleHistory);
    }

    @Override
    public void asyncTask(ReserveJobDTO reserveJob, Long taskSeq) {

        try {
            logger.debug("=========== sleep : "+ McpDate.term(reserveJob.getReserveDt()));
            Thread.sleep(McpDate.term(reserveJob.getReserveDt()));

            //실행 전 유효한 reserved 인지 체크
            scheduleHistory = jobContentService
                    .findGenStatusHistoryById(reserveJob.getSeqNo())
                    .orElseThrow();

            invoke(reserveJob, taskSeq);

            //실행 후 상태변경 후 저장
            scheduleHistory.setStatus("9");
            jobContentService.updateGenStatusHistory(scheduleHistory);
        } catch (Exception ex) {
            logger.error("reserved invoke error ", ex);
        } finally {
            finish(taskSeq);
        }

    }

    /**
     * 각 Job별 기능 구현
     */
    public abstract void invoke(ReserveJobDTO reserveJob, Long taskSeq);
}
