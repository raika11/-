package jmnet.moka.web.push.support.scheduler;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.File;
import java.io.IOException;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import javax.annotation.PostConstruct;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.push.config.PropertyHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * Shedule Job Handler
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.schedule.service
 * ClassName : ScheduleJobHandler
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
@Component
@Slf4j
public class PushSchedulerHandler {

    /**
     * 스케줄 설정 정보 파일
     */
    private final String RESOURCE_PATH = "schedule-info.json";

    @Autowired
    private ApplicationContext context;

    @Autowired
    public ThreadPoolTaskScheduler taskScheduler;

    @Autowired
    private PropertyHolder propertyHolder;

    @Autowired
    private Environment environment;

    private Map<String, ScheduledFuture<?>> scheduleMap;



    /**
     * 스케줄 Map 초기화
     */
    @PostConstruct
    public void initSchedulerMap() {

        if (propertyHolder.getScheduleAction()) { // 스케줄 작업 실행 여부 체크
            scheduleMap = new IdentityHashMap<>();

            String SPRING_PROFILES_ACTIVE = System.getProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "");
            String resourcePath =
                    McpString.isEmpty(SPRING_PROFILES_ACTIVE) ? RESOURCE_PATH : McpFile.addSuffix(RESOURCE_PATH, "-" + SPRING_PROFILES_ACTIVE);
            Resource resource = new ClassPathResource(resourcePath);
            try {
                File file = resource.getFile();
                if (file.exists()) {
                    TypeReference<List<PushSchedulerJob>> typeRef = new TypeReference<>() {
                    };

                    List<PushSchedulerJob> scheduleList = ResourceMapper
                            .getDefaultObjectMapper()
                            .readValue(file, typeRef);
                    for (PushSchedulerJob info : scheduleList) {
                        appendJob(info);
                    }

                }
            } catch (IOException io) {
                log.error("FtpHelper error => exception : {}", io.getMessage());
            }
        }
    }


    /**
     * 스케줄 Job 추가
     *
     * @param pushSchedulerJob 스케줄 정보
     * @return 추가 여부
     */
    public boolean appendJob(PushSchedulerJob pushSchedulerJob) {
        boolean result = false;
        try {
            // 클래스 bean생성
            if (McpString.isNotEmpty(pushSchedulerJob.getClassName())) {
                Runnable r = getRunnable(pushSchedulerJob);
                ScheduledFuture<?> scheduledFuture = taskScheduler.schedule(r, new CronTrigger(pushSchedulerJob.getTerm()));
                log.info("pushSchedulerJob.getName()>>>"+pushSchedulerJob.getName());
                scheduleMap.put(pushSchedulerJob.getName(), scheduledFuture);
                result = true;
            }
        } catch (BeansException | ClassNotFoundException e) {
            // TODO Auto-generated catch block
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

    private Runnable getRunnable(PushSchedulerJob info)
            throws BeansException, ClassNotFoundException {
        try {
            Scheduler task = (Scheduler) context.getBean(Class.forName(info.getClassName()));
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
