package jmnet.moka.web.schedule.support.schedule;

import java.util.*;
import java.util.concurrent.ScheduledFuture;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.schedule.config.PropertyHolder;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * Shedule Job Handler
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.service
 * ClassName : ScheduleJobHandler
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
@Component
@Slf4j
public class ScheduleJobHandler {

    private final GenContentService jobContentService;

    private final ApplicationContext context;

    public final ThreadPoolTaskScheduler taskScheduler;

    private final PropertyHolder propertyHolder;

    final Environment environment;

    private Map<Long, ScheduledFuture<?>> scheduleMap;

    public ScheduleJobHandler(GenContentService jobContentService, ApplicationContext context, ThreadPoolTaskScheduler taskScheduler,
            PropertyHolder propertyHolder, Environment environment) {
        this.jobContentService = jobContentService;
        this.context = context;
        this.taskScheduler = taskScheduler;
        this.propertyHolder = propertyHolder;
        this.environment = environment;
    }

    /**
     * 스케줄 Map 초기화
     */
    @PostConstruct
    public void initSchedulerMap() {

        if (propertyHolder.getScheduleAction()) { // 스케줄 작업 실행 여부 체크
            //scheduleMap = new IdentityHashMap<>();
            //key value만으로 key값을 처리하기 위해 일반해쉬맵으로 변경
            scheduleMap = new HashMap<>();
            //List<GenContent> scheduleList = jobContentService.findAllJobContent();
            List<GenContent> scheduleList = jobContentService.findAllScheduleJobContent();
            for (GenContent info : scheduleList) {

                //우선 350서버만 통과
                if(info.getServerSeq() == 350) {
                    info.setProgrameNm("jmnet.moka.web.schedule.mvc.schedule.service.DummyScheduleJob");
                }

                appendJob(info);
            }
        }
    }

    /**
     * 스케줄 Job 추가
     *
     * @param jobSeq 스케줄 정보
     * @return 추가 여부
     */
    public boolean appendJob(Long jobSeq) {
        GenContent genContent = jobContentService
                .findJobContentBySeq(jobSeq)
                .orElseThrow();

        //우선 350서버만 통과
        if(genContent.getServerSeq() == 350) {
            genContent.setProgrameNm("jmnet.moka.web.schedule.mvc.schedule.service.DummyScheduleJob");
        }

        return appendJob(genContent);

    }

    /**
     * 스케줄 Job 추가
     *
     * @param genContent 스케줄 정보
     * @return 추가 여부
     */
    public boolean appendJob(GenContent genContent) {
        boolean result = false;
        try {
            // 클래스 bean생성
            if (McpString.isNotEmpty(genContent.getProgrameNm())) {
                Runnable r = getRunnable(genContent);
                /**
                 * todo 1. 변경 된 테이블에 DummyScheduleJob 데이터 추가 후 해당 조건을 통과하는지 체크 필요
                 */
                if (McpString
                        .defaultValue(genContent.getJobType())
                        .equals("S") && genContent.getPeriod() > 0) {

                    //ScheduledFuture<?> scheduledFuture = taskScheduler.scheduleAtFixedRate(r, genContent.getPeriod() * 1000);
                    //등록 시 바로 JOB이 실행되는 관계로 PERIOD 만큼 시작시간을 늦춰서 등록 추가
                    Calendar startTime = Calendar.getInstance();
                    startTime.setTime(new Date());
                    startTime.add(Calendar.SECOND, genContent.getPeriod().intValue());
                    ScheduledFuture<?> scheduledFuture = taskScheduler.scheduleAtFixedRate(r, startTime.getTime(),genContent.getPeriod() * 1000);
                    
                    scheduleMap.put(genContent.getJobSeq(), scheduledFuture);
                    result = true;
                }
            }
        } catch (BeansException | ClassNotFoundException e) {
            log.error(e.toString());
        }

        return result;
    }

    /**
     * 스케줄 Job 제거
     *
     * @param jobSeq 스케줄 일련번호
     * @return 추가 여부
     */
    public boolean removeJob(Long jobSeq) {
        boolean result = false;

        if (scheduleMap.containsKey(jobSeq)) {
            scheduleMap
                    .get(jobSeq)
                    .cancel(true);
            scheduleMap.remove(jobSeq);


            result = true;
        }

        return result;
    }

    private Runnable getRunnable(GenContent info)
            throws BeansException, ClassNotFoundException {
        try {
            ScheduleJob task = (ScheduleJob) context.getBean(Class.forName(info.getProgrameNm()));
            return new Runnable() {
                @Override
                public void run() {
                    task.doTask(info);
                }
            };
        } catch (BeansException | ClassNotFoundException e) {
            throw e;
        }
    }
}
