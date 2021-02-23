package jmnet.moka.web.schedule.support.reserve;

import java.util.List;
import java.util.concurrent.Executor;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.schedule.config.PropertyHolder;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.support.StatusFlagType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * ReserveJobHandler
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
public class ReserveJobHandler {
    @Autowired
    private GenContentService jobContentService;

    @Autowired
    private ApplicationContext context;

    @Autowired
    public Executor reserveJobTaskExecutor;

    @Autowired
    private PropertyHolder propertyHolder;

    /**
     * 예약작업 초기화
     */
    @PostConstruct
    public void initReservedJob() {
        // todo 1. 작업 목록을 조회하여 미실행된 status_flag = 0인 9인 작업 예약 작업으로 추가
        try {
            if (propertyHolder.getReservedAction()) { // 예약 스케줄 초기화 실행 여부 체크
                //Reserved Job 조회
                List<GenContent> scheduleList = jobContentService.findAllReservedJobContent();

                for (GenContent info : scheduleList) {

                    //Reserved Job의 예약상태 조회
                    GenContentHistory genStatusHist = jobContentService.findGenContentHistory(info.getJobSeq());
                    if (genStatusHist != null) {
                        addReserveJob(genStatusHist);
                    }
                }
            }
        } catch (Exception e) {
            log.error("init ReserveJob fail {}", e);
        }
    }


    /**
     * 비동기 예약 작업 추가
     *
     * @param history job task 정보
     */
    public boolean addReserveJob(GenContentHistory history) {
        boolean result = false;

        // PKG_NM 이 등록된 경우만 Job 할당 가능 + 예약시간이 미래시간인 경우 실행
        // 작업예약상태가 0(실행대기)인 경우만 등록, 9(실행 중)은 다른 서버에서 실행 중인 JOB을 간주하여 미등록
        GenContent genContent = history.getGenContent();
        if (McpString.isNotEmpty(genContent.getProgrameNm()) && 0 < McpDate.term(history.getReserveDt()) && history
                .getStatus()
                .equals(StatusFlagType.READY)) {
            try {
                ReserveJob job = (ReserveJob) context.getBean(Class.forName(genContent.getProgrameNm()));
                Long newTaskSeq = history.getSeqNo();    //reservedJob taskSeq 에 TB_GEN_CONTENT_HIST.SEQ_NO 입력
                reserveJobTaskExecutor.execute(() -> job.asyncTask(history, newTaskSeq));
                result = true;
            } catch (BeansException | ClassNotFoundException e) {
                log.error(e.toString());
            }
        }
        return result;
    }

    /**
     * 비동기 예약 작업 제거
     *
     * @param reserveJobProcSeq 작업 일련번호
     */
    public boolean removeReserveJob(Long reserveJobProcSeq) {
        boolean result = false;

        // todo 3. 예약 작업 테이블에 del_yn을 'N'으로 변경
        GenContentHistory scheduleHistory = jobContentService
                .findGenContentHistoryById(reserveJobProcSeq)
                .orElseThrow();

        //DEL_YN을 Y로 변경 처리
        if (scheduleHistory != null) {
            scheduleHistory.setDelYn("Y");
            jobContentService.updateGenContentHistory(scheduleHistory);

            result = true;
        }

        return result;
    }


}
