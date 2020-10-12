package jmnet.moka.web.tms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import jmnet.moka.core.common.aspect.CommandControllerIpAllowAspect;

@Configuration
public class CustomTmsConfiguration {

    public static final Logger logger = LoggerFactory.getLogger(CustomTmsConfiguration.class);

    @Value("${tms.merge.handler.class}")
    private String defaultHandlerClass;

    @Value("${tms.merge.handler.beanName}")
    private String defaultHandlerBeanName;

    @Value("${tms.merge.handler.method}")
    private String defaultHandlerMethodName;

    @Value("${tms.merge.view.class}")
    private String defaultViewClass;

    @Value("${tms.merge.view.name}")
    private String defaultViewName;

    @Value("${tms.default.template.domain}")
    private String defaultTemplateDomain;

    @Value("${command.allow.ips}")
    private String commandAllowIps;

    @Autowired(required = false)
    @Qualifier("tmsHandlerInterceptor")
    HandlerInterceptorAdapter tmsHandlerInterceptor;



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
