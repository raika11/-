package jmnet.moka.core.dps.api.ext;

import java.util.HashMap;
import java.util.Map;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ApiParameterChecker;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.ApiResolver;
import jmnet.moka.core.dps.api.handler.ApiRequestHandler;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.excepton.ParameterException;

public class ApiPeriodicTask implements Runnable {
	
	private ApiRequestHandler apiRequestHandler;	
	private ApiContext apiContext;
    private static Map<String, String> EMPTY_PARAM_MAP = new HashMap<String, String>(0);
	
	public ApiPeriodicTask(GenericApplicationContext applicationContext,
			Api api) throws ParameterException {
		ApiRequestHelper apiRequestHelper = applicationContext.getBean(ApiRequestHelper.class);
		this.apiRequestHandler = applicationContext.getBean(ApiRequestHandler.class);
		ApiParameterChecker apiParameterChecker = applicationContext.getBean(ApiParameterChecker.class);
		this.apiContext = new ApiContext(apiRequestHelper, apiParameterChecker, 
				new ApiResolver(api.getApiConfig().getPath(), api.getId()), EMPTY_PARAM_MAP);
	}

	@Override
	public void run() {
		this.apiRequestHandler.apiPeriodicRequest(this.apiContext.getApiPath(), this.apiContext.getApiId());
	}

}
