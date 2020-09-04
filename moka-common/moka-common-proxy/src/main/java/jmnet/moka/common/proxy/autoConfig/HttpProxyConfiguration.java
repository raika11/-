package jmnet.moka.common.proxy.autoConfig;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.SocketConfig;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.proxy.http.ApiHttpProxyFactory;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.proxy.http.HttpShortKeepAliveStrategy;

@Configuration
@Import(ProxyCommonConfiguration.class)
@PropertySource("classpath:http-proxy-auto.properties")
public class HttpProxyConfiguration {
	
	public static final String API_HTTP_PROXY = "apiHttpProxy";
	public static String HTTP_PROXY = "httpProxy";
	
	@Value("#{timeHumanizer.parse('${httpProxy.client.socket.timeout}')}")
	private int clientSocketTimeout;
	@Value("#{timeHumanizer.parse('${httpProxy.client.connect.timeout}')}")
	private int clientConnectTimeout;
	@Value("${httpProxy.client.redirect.enable}")
	private boolean clientRedirectEnable;
	@Value("#{timeHumanizer.parse('${httpProxy.client.request.timout}')}")
	private int clientRequestTimeout;
	@Value("${httpProxy.client.header.userAgent}")
	private String clientHeaderUserAgent;
	
	/**
     * <pre>
     * Scope가 prototype인 api용 HttpProxy를 생성한다.
     * bean 생성방법
     * {code}
     * HttpProxy httpProxy = (HttpProxy)applicationContext.getBean(HttpProxyConfiguration.API_HTTP_PROXY, apiHost, apiPath)
     * {code}
     * </pre>
     * 
     * @param apiHost api 호스트
     * @param apiPath api 경로
     * @return HttpProxy 빈
     * @throws KeyManagementException 예외
     * @throws NoSuchAlgorithmException 예외
     * @throws KeyStoreException 예외
     */
	@Bean(name="apiHttpProxy")
	@Scope("prototype")
	public HttpProxy apiHttpProxy(String apiHost, String apiPath) throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
		return new HttpProxy(httpClient(), apiHost, apiPath);
	}

	/**
	 * <pre>
	 * Scope가 prototype인 api용 HttpProxy를 생성한다.
	 * bean 생성방법
	 * {code}
	 * HttpProxy httpProxy = (HttpProxy)applicationContext.getBean(HttpProxyConfiguration.HTTP_PROXY)
	 * {code}
	 * </pre>
	 * @return HttpProxy 빈
	 * @throws KeyManagementException 예외
	 * @throws NoSuchAlgorithmException 예외
	 * @throws KeyStoreException 예외
	 */
	@Bean(name="httpProxy")
	@Scope("prototype")
	public HttpProxy httpProxy() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
		return new HttpProxy(httpClient());
	}

    @Autowired
    private GenericApplicationContext appContext;

    @Bean(name = "apiHttpProxyFactory")
    @ConditionalOnProperty(name = "mcp.ext.proxy.factory.enable", havingValue = "true")
    public ApiHttpProxyFactory apiHttpProxyFactory() {
        return new ApiHttpProxyFactory(appContext);
    }

	@Bean(name="httpClient", destroyMethod="close")
	public CloseableHttpClient httpClient() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
		RequestConfig requestConfig = RequestConfig.custom()
			.setSocketTimeout(clientSocketTimeout)
			.setConnectTimeout(clientConnectTimeout)
			.setRedirectsEnabled(clientRedirectEnable)
			.setConnectionRequestTimeout(clientRequestTimeout).build();
		
		CloseableHttpClient httpClient = HttpClientBuilder.create()
		.setDefaultRequestConfig(requestConfig)
		.setSSLSocketFactory(sslConnectionFactory())
		.setConnectionManager(poolingHttpClientConnectionManager())
		.setUserAgent(clientHeaderUserAgent)
		.setKeepAliveStrategy(new HttpShortKeepAliveStrategy()).build();
		return httpClient;
	}
	
	@Value("#{timeHumanizer.parse('${httpProxy.pool.socket.soTimeout}')}")
	private int poolSocketSoTimeout;
	@Value("${httpProxy.pool.socket.keepAlive}")
	private boolean poolSocketKeepAlive;
	@Value("${httpProxy.pool.socket.reuseAddress}")
	private boolean poolSocketReuseAddress;
	@Value("${httpProxy.pool.socket.tcpNoDelay}")
	private boolean poolSocketTcpNoDelay;
	@Value("${httpProxy.pool.socket.soLinger}")
	private int poolSocketSoLinger;
	@Value("#{timeHumanizer.parse('${httpProxy.pool.timeout}')}")
	private int poolTimeout;
	@Value("${httpProxy.pool.maxTotal}")
	private int poolMaxTotal;
	@Value("${httpProxy.pool.defaultMaxPerRoute}")
	private int poolDefaultMaxPerRoute;
	
	@Bean(destroyMethod="shutdown")
	public PoolingHttpClientConnectionManager poolingHttpClientConnectionManager() {
		SocketConfig socketConfig = SocketConfig.custom()
				.setSoTimeout(poolSocketSoTimeout) 		//소켓이 연결된후 InputStream에서 읽을때 timeout
				.setSoKeepAlive(poolSocketKeepAlive)		//SO_KEEPALIVE를 활성화 할 경우 소켓 내부적으로 일정시간 간격으로 heartbeat을 전송하여, 비정상적인 세션 종료에 대해 감지.
				.setSoReuseAddress(poolSocketReuseAddress)	//비정상종료된 상태에서 아직 커널이 소켓의 bind정보를 유지하고 있을 때 해당 소켓을 재사용 할 수 있도록
				.setTcpNoDelay(poolSocketTcpNoDelay)		//nagle 알고리즘 적용 여부
				.setSoLinger(poolSocketSoLinger)			//ocket이 close 될 때 버퍼에 남아 있는 데이터를 보내는데 기다려주는 시간(blocked)
				.build();
		PoolingHttpClientConnectionManager httpClientPool = new PoolingHttpClientConnectionManager(poolTimeout, TimeUnit.MILLISECONDS);
		httpClientPool.setMaxTotal(poolMaxTotal);
		httpClientPool.setDefaultMaxPerRoute(poolDefaultMaxPerRoute);
		httpClientPool.setDefaultSocketConfig(socketConfig);
		return httpClientPool;
	}
	
	private SSLConnectionSocketFactory sslConnectionFactory() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
		// use the TrustSelfSignedStrategy to allow Self Signed Certificates
        SSLContext sslContext = SSLContextBuilder
                .create()
                .loadTrustMaterial(new TrustSelfSignedStrategy())
                .build();
        // we can optionally disable hostname verification. 
        // if you don't want to further weaken the security, you don't have to include this.
        HostnameVerifier allowAllHosts = new NoopHostnameVerifier();
        
        // create an SSL Socket Factory to use the SSLContext with the trust self signed certificate strategy
        // and allow all hosts verifier.
        return new SSLConnectionSocketFactory(sslContext, allowAllHosts);
	}
}
