package jmnet.moka.core.common.sns;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MokaSnsConfiguration {

    @ConditionalOnProperty(name = "moka.sns-publish.enable", havingValue = "true")
    @Bean("facebookApiService")
    public SnsApiService facebookApiService() {
        return new FacebookApiServiceImpl();
    }

    @ConditionalOnProperty(name = "moka.sns-publish.enable", havingValue = "true")
    @Bean("twitterApiService")
    public SnsApiService twitterApiService() {
        return new TwitterApiServiceImpl();
    }
}
