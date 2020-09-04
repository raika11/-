package jmnet.moka.common.proxy.http;

import org.apache.http.HeaderElement;
import org.apache.http.HeaderElementIterator;
import org.apache.http.HttpResponse;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.message.BasicHeaderElementIterator;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpShortKeepAliveStrategy implements ConnectionKeepAliveStrategy {

    private static final Logger logger = LoggerFactory.getLogger(HttpShortKeepAliveStrategy.class);
    private static final long KEEP_ALIVE_TIMEOUT_SEC = 5;

    @Override
	public long getKeepAliveDuration(HttpResponse response, HttpContext context) {

		// Honor 'keep-alive' header
		HeaderElementIterator it = new BasicHeaderElementIterator(response.headerIterator(HTTP.CONN_KEEP_ALIVE));
		while (it.hasNext()) {
			HeaderElement he = it.nextElement();
			String param = he.getName();
			String value = he.getValue();
			if (value != null && param.equalsIgnoreCase("timeout")) {
				try {
                    return Long.parseLong(value) * 1000;
				} catch (NumberFormatException ignore) {
                    logger.warn(ignore.getMessage());
				}
			}
		}

//		HttpHost target = (HttpHost) context.getAttribute(HttpClientContext.HTTP_TARGET_HOST);
//		if ("www.mydomain.com".equalsIgnoreCase(target.getHostName())) {
//			// Keep alive for 5 seconds only
//			return 5 * 1000;
//		} else {
//			// otherwise keep alive for 1 seconds
//			return 1 * 1000;
//		}
        return KEEP_ALIVE_TIMEOUT_SEC * 1000;
	}

}
