package jmnet.moka.web.schedule.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

@Configuration
@EnableAsync
@EnableScheduling
public class ScheduleConfiguration implements SchedulingConfigurer {

    @Value("${scheduler.pool.size:20}")
    private Integer poolSize;

    private ThreadPoolTaskScheduler taskScheduler;

    protected final transient Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * To configure the task executer
     *
     * @param taskRegistrar the scheduled task registrar
     */
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(taskExecutor());
    }

    /**
     * @return executor for the scheduler (naming convention)
     */
    @Bean(name = "scheduleJobTaskExecutor", destroyMethod = "shutdown")
    public ThreadPoolTaskScheduler taskExecutor() {
        // use the Spring ThreadPoolTaskScheduler
        taskScheduler = new ThreadPoolTaskScheduler();
        // always set the poolsize
        taskScheduler.setPoolSize(poolSize);
        // for logging add a threadNamePrefix
        taskScheduler.setThreadNamePrefix("SCHDULE");
        // do not wait for completion of the task
        taskScheduler.setWaitForTasksToCompleteOnShutdown(true);

        return taskScheduler;
    }
}
