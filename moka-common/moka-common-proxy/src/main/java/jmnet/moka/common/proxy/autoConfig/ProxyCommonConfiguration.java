package jmnet.moka.common.proxy.autoConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jmnet.moka.common.TimeHumanizer;

@Configuration
public class ProxyCommonConfiguration {
	
	@Bean
	public TimeHumanizer timeHumanizer() {
		return new TimeHumanizer();
	}
}
