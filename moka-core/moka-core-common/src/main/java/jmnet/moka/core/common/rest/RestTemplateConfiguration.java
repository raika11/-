package jmnet.moka.core.common.rest;

import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.rest
 * ClassName : RestTemplateConfiguration
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:03
 */
@Configuration
@Slf4j
public class RestTemplateConfiguration {
    /**
     * HTTP Connection 최대수
     */
    @Value("${interface.connection.max.total:100}")
    private int maxTotal;
    /**
     * 각 도메인 당 최대 Connection 수
     */
    @Value("${interface.connection.max.per.route:50}")
    private int maxPerRoute;
    /**
     * connection timeout
     */
    @Value("${interface.connection.timeout:5000}")
    private int connectionTimeout;
    /**
     * connection read timeout
     */
    @Value("${interface.connection.read.timeout:10000}")
    private int connectionReadTimeout;

    /**
     * connection read timeout
     */
    @Value("${interface.connection.read.timeout:100000}")
    private int keepAliveDuration;

    /**
     * connection read timeout
     */
    @Value("${interface.connection.max.idel:20}")
    private int maxIdleConnections;


    /**
     * <pre>
     * RestTemplate Bean 객체 생성
     * </pre>
     *
     * @return RestTemplate
     */
    @Bean
    @ConditionalOnProperty(name = "moka.rest-template.enable", havingValue = "true")
    public RestTemplateHelper restTemplate()
            throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        RestTemplate restTemplate = new RestTemplate();

        List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
        messageConverters.add(new StringHttpMessageConverter(Charset.forName("utf-8")));

        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(connectionReadTimeout, TimeUnit.MILLISECONDS)
                .connectTimeout(connectionTimeout, TimeUnit.MILLISECONDS)
                .connectionPool(new ConnectionPool(maxIdleConnections, keepAliveDuration, TimeUnit.MILLISECONDS)) //커넥션풀 적용
                .hostnameVerifier((hostname, session) -> true)
                .build();


        OkHttp3ClientHttpRequestFactory crf = new OkHttp3ClientHttpRequestFactory(client);
        restTemplate.setRequestFactory(crf);
        return new RestTemplateHelper(restTemplate);
    }
}
