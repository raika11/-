package jmnet.moka.web.dps.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jmnet.moka.core.common.aspect.CommandControllerIpAllowAspect;

@Configuration
public class CustomDpsConfiguration {

    public static final Logger logger = LoggerFactory.getLogger(CustomDpsConfiguration.class);

    @Value("${command.allow.ips}")
    private String commandAllowIps;

    //    @Autowired
    //    private GenericApplicationContext appContext;

    /**
     * 
     * <pre>
     * Command Api를 IP 기반의 접근제어를 설정한다.
     * </pre>
     * 
     * @return
     */
    @Bean
    public CommandControllerIpAllowAspect commandControllerIpAllowAspect() {
        return new CommandControllerIpAllowAspect(commandAllowIps);
    }

}
