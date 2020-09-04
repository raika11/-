package jmnet.moka.core.dps.api.handler;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.dps.api.ApiContext;
import jmnet.moka.core.dps.api.ext.AsyncRequestContext;
import jmnet.moka.core.dps.api.model.SampleRequest;

public class SampleRequestHandler implements RequestHandler {
	public final transient Logger logger = LoggerFactory.getLogger(getClass());
	private String configBaseAbsolutePath;
	private String sampleJsonPath;
	
	public SampleRequestHandler(String configBasePath, String sampleJsonPath) throws IOException {
		this.configBaseAbsolutePath = ResourceMapper.getAbsolutePath(configBasePath);
		this.sampleJsonPath = sampleJsonPath;
	}
	
	@Override
	public ApiResult processRequest(ApiContext apiContext) {
		long startTime = System.currentTimeMillis();
		SampleRequest sampleRequest = (SampleRequest)apiContext.getCurrentRequest();
		String path = apiContext.getApiPath();
		String jsonFileName = sampleRequest.getJsonFileName();
		String jsonFilePath = String.join("/", this.configBaseAbsolutePath, path, sampleJsonPath, jsonFileName);
		File jsonFile = new File(jsonFilePath);
		try {
            List<Map<String, Object>> sampleData =
                    ResourceMapper.readJson(jsonFile, ResourceMapper.TYPEREF_LIST_MAP);
			long endTime = System.currentTimeMillis();
			ApiResult mainResult = ApiResult.createApiResult(startTime, endTime, sampleData, true, null);
			List<Integer> total = new ArrayList<Integer>();
			total.add(sampleData.size());
			mainResult.addApiResult(ApiResult.MAIN_TOTAL, ApiResult.createApiResult(startTime, endTime, total, true, null));
			return mainResult;
		} catch (IOException e) {
			return ApiResult.createApiErrorResult(e);
		}
	}

	@Override
	public void processAsyncRequest(AsyncRequestContext asyncRequestContext) {
		// sample json에 대한 async는 사용하지 않음
	}
}
