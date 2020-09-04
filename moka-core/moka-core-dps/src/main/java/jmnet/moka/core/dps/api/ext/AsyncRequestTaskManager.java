package jmnet.moka.core.dps.api.ext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.task.TaskRejectedException;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

public class AsyncRequestTaskManager {
	public static final Logger logger = LoggerFactory.getLogger(AsyncRequestTaskManager.class);
	
	private ThreadPoolTaskExecutor executor;
	
	public AsyncRequestTaskManager(ThreadPoolTaskExecutor executor) {
		this.executor = executor;
	}
	
	public void processAsyncRequest(AsyncRequestTask task) {
		try {
			this.executor.execute(task);
			logger.debug("asyncRequest thread count:{}",executor.getActiveCount());
		} catch (TaskRejectedException e) {
			logger.warn("AsyncRequest is rejected: {}",e.getMessage());
		}
	}

}
