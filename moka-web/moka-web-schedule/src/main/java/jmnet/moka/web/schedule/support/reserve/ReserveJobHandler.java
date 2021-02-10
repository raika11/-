package jmnet.moka.web.schedule.support.reserve;

import java.util.concurrent.Executor;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.mvc.reserve.dto.ReserveJobDTO;
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

    /**
     * 예약작업 초기화
     */
    @PostConstruct
    public void initSchedulerMap() {
        // todo 1. 작업 목록을 조회하여 미실행된 status_flag = 0인 9인 작업 예약 작업으로 추가
    }

    /**
     * 비동기 예약 작업 추가
     *
     * @param reserveJob 작업 정보
     */
    public boolean addReserveJob(ReserveJobDTO reserveJob) {
        /**
         * todo 2. 작업 정보로 GenContent 조회
         * - 작업 정보의 컬럼명은 확정되지 않음
         */
        GenContent genContent = null;

        return addReserveJob(reserveJob, genContent);
    }

    /**
     * 비동기 예약 작업 추가
     *
     * @param genContent job 정보
     */
    public boolean addReserveJob(ReserveJobDTO reserveJob, GenContent genContent) {
        boolean result = false;
        if (McpString.isNotEmpty(genContent.getProgrameNm())) {// 프로그램명이 존재할 경우 실행
            try {
                ReserveJob job = (ReserveJob) context.getBean(Class.forName(genContent.getProgrameNm()));
                Long newTaskSeq = 0l;
                reserveJobTaskExecutor.execute(() -> job.asyncTask(reserveJob, newTaskSeq));
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

        // todo 3. 예약 작업 테이블에 del_yn을 'N'으로 변경
        return false;
    }


}
