package jmnet.moka.web.schedule.support.reserve;

import java.util.Date;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.mvc.gen.service.GenStatusService;
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
    protected GenStatusService jobStatusService;

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

        logger.debug("finish history seqno : {} jobSeq : {}, complete : {}", history.getSeqNo(), history.getJobSeq(), history
                .getStatus()
                .name());

        //실행 완료 시 GenStatus 저장
        GenStatus scheduleResult = history.getGenContent().getGenStatus();
        //현재 genResult + lastExecdt 만 입력 중
        if(history.getStatus() == StatusFlagType.DONE){
            scheduleResult.setGenResult(200L);  //성공
        }
        scheduleResult.setLastExecDt(new Date());
        scheduleResult = jobStatusService.updateGenStatus(scheduleResult);

        logger.debug("{} finish : {}", scheduleResult.getJobSeq(), scheduleResult.getGenResult());
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

            //실행 전 작업예약 상태변경 후 저장
            scheduleHistory.setStartDt(McpDate.now());
            scheduleHistory.setStatus(StatusFlagType.PROCESSING);
            scheduleHistory = jobContentService.updateGenContentHistory(scheduleHistory);
            logger.debug("start task jobseq : {}", history.getSeqNo());

            //history에 해당하는 GenStatus가 없는 경우 생성
            GenStatus scheduleResult = scheduleHistory.getGenContent().getGenStatus();
            if(scheduleResult == null){
                jobStatusService.insertGenStatus(scheduleHistory.getJobSeq());
            }
            //genStatus가 존재하는 경우 작업시작 전 작업실패 상태로 갱신 (에러발생 시 shutdown 되는 경우로 인해 완료 시 성공처리)
            else{
                scheduleResult.setGenResult(500L);
                scheduleResult.setLastExecDt(new Date());
                jobStatusService.updateGenStatus(scheduleResult);
            }

            // 각 예약 작업 처리
            invoke(scheduleHistory);

        } catch (Exception ex) {
            /**
             * todo 2. 에러발생시 status 5로 update
             */
            // 유효한 작업인 경우 > 실패 설정
            if(scheduleHistory != null){
                scheduleHistory.setStatus(StatusFlagType.ERROR_SERVER);
            }
            logger.error("reserved invoke error ", ex);
        } finally {
            // 유효한 작업인경우 > 마무리
            if(scheduleHistory != null) {
                finish(scheduleHistory);
            }
        }

    }

    /**
     * 각 Job별 기능 구현
     */
    public abstract GenContentHistory invoke(GenContentHistory history);
}
