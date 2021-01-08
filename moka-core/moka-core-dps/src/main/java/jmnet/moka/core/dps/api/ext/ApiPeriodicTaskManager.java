package jmnet.moka.core.dps.api.ext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ScheduledFuture;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.ApiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;

public class ApiPeriodicTaskManager {
	public final static Logger logger = LoggerFactory.getLogger(ApiPeriodicTaskManager.class);
	private GenericApplicationContext applicationContext;

	private ThreadPoolTaskScheduler scheduler;
	
	private ApiRequestHelper apiRequestHelper;
	
	private Map<String, ScheduledFuture<?>> futureMap;
	
	@Autowired
	public ApiPeriodicTaskManager(GenericApplicationContext applicationContext,
			ThreadPoolTaskScheduler scheduler, ApiRequestHelper apiRequestHelper) {
		this.applicationContext = applicationContext;
		this.scheduler = scheduler;
		this.apiRequestHelper = apiRequestHelper;
		this.futureMap = new HashMap<String,ScheduledFuture<?>>(32);
	}
	
	@PostConstruct
	@SuppressWarnings("unchecked")
	public void registerAll() {
		HashMap<String, List<ApiConfig>> apiConfigMappingMap = (HashMap<String, List<ApiConfig>>)this.apiRequestHelper.getApiList(null);
		for (List<ApiConfig> list: apiConfigMappingMap.values()) {
			for (ApiConfig apiConfig: list) {
				String apiPath = apiConfig.getPath();
				Map<String, Api> map = apiConfig.getApiMap();
				for (Api api: map.values()) {
					String period = api.getPeriod();
					if ( period != null && period.length()>1) {
						String[] split = period.split(" ");
						ApiPeriodicTask task = (ApiPeriodicTask)applicationContext.getBean("apiPeriodicTask",api);
						try {
							ScheduledFuture<?> future = null;
							if ( split.length > 1) { // cron 타입
								future = scheduler.schedule(task, new CronTrigger(period));
							} else { // fix rate 타입
								future = scheduler.scheduleAtFixedRate(task, TimeHumanizer.parse(period));
							}
							this.futureMap.put(makeKey(apiPath, api.getId()), future);
						} catch (Exception e) {
							// 서비스의 구동이 멈추지 않도록 warning 후 다음 task를 등록한다.
							logger.warn("ApiPeriodicTask does not scheduled: [{}] [{}]",api.getId(), period);
							e.printStackTrace();
						}
					}
				}
			}
		}
	}
	
	public void unregisterSchedule(String apiPath, String apiId) {
		ScheduledFuture<?> task = this.futureMap.get(makeKey(apiPath, apiId));
		if ( task != null) {
			task.cancel(true);
			logger.debug("ApiPeriodicTask's isCancelled, isDone: {} {} {} {}",apiPath, apiId, task.isCancelled(), task.isDone());
		} else {
			logger.debug("ApiPeriodicTask not exists: {} {}",apiPath, apiId);
		}
	}
	
	@PreDestroy
	public void beforeShutdown() {
		for ( Entry<String, ScheduledFuture<?>> entry : this.futureMap.entrySet()) {
			entry.getValue().cancel(true);
			logger.debug("ApiPeriodicTask request cancel: {}", entry.getKey());
		}
	}
	
	
	private String makeKey(String apiPath, String apiId) {
		return apiPath+"_"+apiId;
	}
	
}
