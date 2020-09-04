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
    private String templateMergeHandlerClass;

    @Value("${tms.merge.handler.beanName}")
    private String templateMergeHandlerBeanName;

    @Value("${tms.merge.handler.method}")
    private String templateMergeHandlerMethod;

    @Value("${tms.merge.view.class}")
    private String viewClass;

    @Value("${tms.merge.view.name}")
    private String viewName;

    @Value("${tms.template.base}")
    private String templateBase;


    @Value("${tms.default.template.domain}")
    private String defaultTemplateDomain;

    @Value("${tms.domains.json}")
    private String domainsJson;

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
