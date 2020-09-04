package jmnet.moka.common.template.loader;

import static jmnet.moka.common.template.Constants.DEFAULT_DATA_NAME;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.merge.MergeContext;


public interface DataLoader {
	public String getRawData(String url, Map<String, Object> parameterMap, boolean isApi) throws DataLoadException ;
	public JSONResult getJSONResult(String url, Map<String, Object> parameterMap, boolean isApi) throws DataLoadException ;
	default public void setData(String api, Map<String, Object> parameterMap, MergeContext context) throws DataLoadException {
		JSONResult jsonResult = getJSONResult(api, parameterMap, true);					
		context.set(DEFAULT_DATA_NAME, jsonResult);
			
		// TOTAL 예외 처리
		JSONResult total = (JSONResult)jsonResult.get(ApiResult.MAIN_TOTAL);
		if ( total.isEmpty() == false) {
			context.set(ApiResult.MAIN_TOTAL, total.get(ApiResult.MAIN_DATA));
		}
	}
}
