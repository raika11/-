package jmnet.moka.common.template.loader;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Map;

import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.DataLoadException;

public class HttpProxyDataLoader extends AbstractDataLoader {
	private static final Logger logger = LoggerFactory.getLogger(HttpProxyDataLoader.class);
	private HttpProxy httpProxy;
	
	@Autowired
	public HttpProxyDataLoader(HttpProxy httpProxy) {
		this.httpProxy = httpProxy;
	}
		
	@Override
	public JSONResult getJSONResult(String url, Map<String, Object> parameterMap, boolean isApi) throws DataLoadException  {
		try {
			JSONResult jsonResult = httpProxy.getApiResult(url, parameterMap, isApi);
			logger.debug("Data Loaded: {}, key={}", url,  jsonResult.keySet());
			return jsonResult;
		} catch (URISyntaxException | ParseException | IOException e) {
			throw new DataLoadException("Can't Load Json Data : "+e.getMessage(), e);
		}
	}

	@Override
	public String getRawData(String url, Map<String, Object> parameterMap, boolean isApi) throws DataLoadException  {
		try {
			String result = httpProxy.getString(url, parameterMap, isApi);
			logger.debug("Data Loaded: {}, length={}", url, result.length());
			return result;
		} catch (URISyntaxException | IOException e) {
			throw new DataLoadException("Can't Load Json Data : "+e.getMessage(), e);
		}
	}


}
