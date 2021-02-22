package jmnet.moka.core.common.sns;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MokaSnsConfiguration {

    @Bean("facebookApiService")
    public SnsApiService facebookApiService() {
        return new FacebookApiServiceImpl();
    }

    @Bean("twitterApiService")
    public SnsApiService twitterApiService() {
        return new TwitterApiServiceImpl();
    }
}
