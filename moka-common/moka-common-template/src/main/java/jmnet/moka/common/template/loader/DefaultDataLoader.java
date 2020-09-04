package jmnet.moka.common.template.loader;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;
import java.util.Map.Entry;
import java.util.zip.GZIPInputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.DataLoadException;


public class DefaultDataLoader extends AbstractDataLoader {
	private static final Logger logger = LoggerFactory.getLogger(DefaultDataLoader.class);
	public static int DEFAULT_BUFFER_SIZE = 2048;
	public static String DEFAULT_ENCODING = "UTF-8";
	private String apiHost;
	private String apiPath;
	
	public DefaultDataLoader(String apiHost, String apiPath) {
		this.apiHost = apiHost;
		this.apiPath = apiPath;
	}
	
	private String makeUrl(String uri, Map<String, Object> parameterMap, boolean isApi) throws UnsupportedEncodingException {
		String url = uri;
		if ( isApi == true ) {
			url = apiHost +"/" + apiPath + "/" + uri;
		}
		if ( parameterMap != null ) {
			for ( Entry<String, Object> entry : parameterMap.entrySet()) {
				if ( url.contains("?")) {
					url +=  "&" ;
				} else {
					url +=  "?" ;
				}
				url += entry.getKey() + "=" + URLEncoder.encode(entry.getValue().toString(), DEFAULT_ENCODING);
			}
		}
		return url;
	}
	
	@Override
	public String getRawData(String uri, Map<String, Object> parameterMap, boolean isApi) throws DataLoadException   {
		try {
			String url = makeUrl(uri, parameterMap, isApi);
			java.net.URL dataURL = new URL(url);
			HttpURLConnection con = (HttpURLConnection)dataURL.openConnection();
			long startTime = System.currentTimeMillis();
			con.connect();
	//		int status = con.getResponseCode();
	//		String message = con.getResponseMessage();
	//		Map<String, List<String>> headers = con.getHeaderFields();
			InputStream is = con.getInputStream();
			if ("gzip".equals(con.getContentEncoding()))
			{
				is = new GZIPInputStream(is);
			}
			ByteArrayOutputStream bao = new ByteArrayOutputStream();
			int length = readAllBytes(is, bao, DEFAULT_BUFFER_SIZE);
			logger.debug("Data Loaded: {}, length={}, time={}", url, length, System.currentTimeMillis() - startTime);
			return bao.toString("UTF-8");
		} catch ( IOException e) {
			throw new DataLoadException("Can't Load Data : "+e.getMessage() , e);
		}
	}
		
	private int readAllBytes(InputStream is, OutputStream os, int bufferSize) throws IOException {
		byte[] buf = new byte[bufferSize];
        int size  = 0;
        int total = 0;
        while ((size = is.read(buf)) > 0) {
            os.write(buf, 0, size);
            total+=size;
        }	
        return total;
	}

}
