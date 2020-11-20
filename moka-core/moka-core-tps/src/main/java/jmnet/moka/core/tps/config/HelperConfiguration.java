package jmnet.moka.core.tps.config;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.helper.EditFormHelper;
import jmnet.moka.core.tps.helper.PurgeHelper;
import jmnet.moka.core.tps.helper.UploadFileHelper;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.time.Duration;

/**
 * <pre>
 * Helper를 빈으로 생성한다
 * 2020. 4. 22. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 22. 오전 11:40:45
 */
@Configuration
public class HelperConfiguration {

    /**
     * 파일업로드 관련 헬퍼
     *
     * @return 빈
     */
    @Bean
    public UploadFileHelper uploadFileHelper() {
        return new UploadFileHelper();
    }

    /**
     * apiHost + apiPath <=> apiCode 조회 헬퍼
     *
     * @return 빈
     */
    @Bean
    public ApiCodeHelper apiCodeHelper() {
        return new ApiCodeHelper();
    }

    /**
     * 퍼지헬퍼
     *
     * @return 빈
     */
    @Bean
    public PurgeHelper purgeHelper() {
        return new PurgeHelper();
    }

    /**
     * Dynamic Edit Form 빈
     *
     * @return 빈
     */
    @Bean
    public EditFormHelper editFormHelper() {
        final XmlMapper xmlMapper = new XmlMapper();
        return new EditFormHelper(xmlMapper);
    }

    /**
     * RestTemplate 빈
     *
     * @return 빈
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
        return restTemplateBuilder
                .requestFactory(() -> new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory()))
                .setConnectTimeout(Duration.ofMillis(5000)) // connection-timeout
                .setReadTimeout(Duration.ofMillis(5000)) // read-timeout
                .additionalMessageConverters(new StringHttpMessageConverter(Charset.forName("UTF-8")))
                .build();
    }
}
