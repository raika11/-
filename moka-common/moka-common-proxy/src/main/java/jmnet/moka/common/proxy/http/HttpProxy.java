package jmnet.moka.common.proxy.http;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import jmnet.moka.common.JSONResult;

public class HttpProxy {

	public static String API_HOST = "apiHost";
	public static String API_PATH = "apiPath";
	private static final Logger logger = LoggerFactory.getLogger(HttpProxy.class);
	
	@Value("${httpProxy.client.encoding}")
	private String defaultEncoding;
	
	private String apiHost;
	private String apiPath;
	
	private CloseableHttpClient httpClient;
	
//	@Autowired
	public HttpProxy(CloseableHttpClient httpClient, String apiHost, String apiPath) {
		this.httpClient = httpClient;
		this.apiHost = apiHost;
		this.apiPath = apiPath;
	}
	
//	@Autowired
	public HttpProxy(CloseableHttpClient httpClient) {
		this.httpClient = httpClient;
	}
	
	public String getString(String url) throws IOException, URISyntaxException {
		return getString(url, null, false);
	}

	public String getString(String url, boolean isApi) throws IOException, URISyntaxException {
		return getString(url, null, isApi);
	}
		
	public String getString(String uri, Map<String, Object> parameterMap, boolean isApi) throws IOException, URISyntaxException {
		if ( isApi ) {
			uri = this.apiHost + "/" + this.apiPath + "/" + uri;
		}
		HttpGet httpGet = new HttpGet(uri);
		if ( parameterMap != null) {
			httpGet.setURI(addParameters(httpGet, parameterMap));
		}
		long startTime = System.currentTimeMillis();
		CloseableHttpResponse response = httpClient.execute(httpGet);
		String result = EntityUtils.toString(response.getEntity(), defaultEncoding);
		logger.debug("Data Loaded: {}, length={}, time={}", httpGet.getURI().toString(), result.length(), System.currentTimeMillis() - startTime);
		return result;
	}

	public JSONResult getApiResult(String uri, Map<String, Object> parameterMap, boolean isApi) throws IOException, URISyntaxException, ParseException  {
		String httpResult = getString(uri, parameterMap, isApi);
		return JSONResult.parseJSON(httpResult);
	}
	
	private URI addParameters(HttpRequestBase request, Map<String, Object> parameterMap) throws URISyntaxException{
		List<NameValuePair> parameterList = convertToParameterList(parameterMap);
		URI uri = new URIBuilder(request.getURI()).addParameters(parameterList).build();
		return uri;
    }
	
	private List<NameValuePair> convertToParameterList(Map<String, Object> parameterMap){
        List<NameValuePair> paramList = new ArrayList<NameValuePair>(8);
        for ( Entry<String, Object> entry : parameterMap.entrySet()) {
        	if ( entry.getValue() != null) {
        		paramList.add(new BasicNameValuePair(entry.getKey(), entry.getValue().toString()));
        	}
        }
        return paramList;
    }

}
