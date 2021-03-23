package jmnet.moka.core.common.push;

import jmnet.moka.core.common.push.service.PushSendService;
import jmnet.moka.core.common.push.service.PushSendServiceImpl;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MokaPushConfiguration {

    @ConditionalOnProperty(name = "moka.push.enable", havingValue = "true")
    @Bean
    public PushSendService pushSendService() {
        return new PushSendServiceImpl();
    }

}
