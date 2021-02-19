package jmnet.moka.core.common.slack;

import jmnet.moka.core.common.rest.RestTemplateConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.core.common.slack
 * ClassName : MokaSlackConfiguration
 * Created : 2021-02-19 019 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-19 019 오후 1:31
 */
@Configuration
@PropertySource("classpath:slack.properties")
@ComponentScan(basePackages = "jmnet.moka.core.common.slack")
public class MokaSlackConfiguration {
    @Value("${moka.core.slack.url}")
    private String url;

    @Bean
    RestTemplate slackRestTemplate() { return new RestTemplate(); }

    @Bean
    SlackHelper slackHelper() { return new SlackHelper( this.url ); }
}
