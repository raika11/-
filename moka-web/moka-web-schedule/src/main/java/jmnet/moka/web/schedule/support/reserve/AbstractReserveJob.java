package jmnet.moka.web.schedule.support.reserve;

import java.util.Date;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.support.StatusFlagType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

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
    public void finish(GenContentHistory history) {
        // todo 1. 처리 결과 TB_GEN_STATUS 테이블에 update 등 마무리 처리

        //실행 완료 시 상태변경 후 저장
        history.setEndDt(new Date());
        jobContentService.updateGenContentHistory(history);

        logger.debug("reserved jobseq : {} , complete : {}", history.getSeqNo(), history
                .getStatus()
                .name());
    }

    @Override
    public void asyncTask(GenContentHistory history, Long taskSeq) {

        GenContentHistory scheduleHistory = null;
        try {
            logger.debug("reserved jobseq : {} , sleep : {}", history.getSeqNo(), McpDate.term(history.getReserveDt()));
            Thread.sleep(McpDate.term(history.getReserveDt()));

            //실행 전 유효한 작업예약 인지 체크
            scheduleHistory = jobContentService
                    .findGenContentHistoryById(history.getSeqNo())
                    .orElseThrow();

            //실행 전 상태변경 후 저장
            scheduleHistory.setStartDt(McpDate.now());
            scheduleHistory.setStatus(StatusFlagType.PROCESSING);
            scheduleHistory = jobContentService.updateGenContentHistory(scheduleHistory);
            logger.debug("start task jobseq : {}", history.getSeqNo());

            // 각 예약 작업 처리
            invoke(scheduleHistory);

        } catch (Exception ex) {
            /**
             * todo 2. 에러발생시 status 5로 update
             */
            scheduleHistory.setStatus(StatusFlagType.ERROR_SERVER);
            logger.error("reserved invoke error ", ex);
        } finally {
            // 마무리
            finish(scheduleHistory);
        }

    }

    /**
     * 각 Job별 기능 구현
     */
    public abstract GenContentHistory invoke(GenContentHistory history);
}
