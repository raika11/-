package jmnet.moka.core.dps.autoConfig;

import com.google.common.base.Predicate;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.core.common.mvc.interceptor.MokaCommonHandlerInterceptor;
import jmnet.moka.core.dps.api.ApiParameterChecker;
import jmnet.moka.core.dps.api.ApiRequestHelper;
import jmnet.moka.core.dps.api.ext.ApiPeriodicTask;
import jmnet.moka.core.dps.api.ext.ApiPeriodicTaskManager;
import jmnet.moka.core.dps.api.ext.AsyncRequestTaskManager;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.excepton.ParameterException;
import jmnet.moka.core.dps.mvc.ApiRequestHandlerMapping;
import jmnet.moka.core.dps.mvc.forward.ForwardHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.BasicAuth;
import springfox.documentation.service.Contact;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.service.SecurityScheme;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@PropertySource("classpath:dps-auto.properties")
@EnableAspectJAutoProxy
@EnableSwagger2
@ComponentScan(basePackages = {"jmnet.moka.core.dps.api"})
public class DpsApiAutoConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(DpsApiAutoConfiguration.class);

    @Value("${dps.config.base}")
    private String configBasePath;

    @Value("${dps.config.sys.base}")
    private String configSysBasePath;

    @Value("${dps.config.api.xml}")
    private String apiXmlFileName;

    @Value("${dps.config.default.xml}")
    private String defaultConfigXml;

    @Value("${dps.apiRequest.handler.class}")
    private String apiRequestHandlerClass;
    @Value("${dps.apiRequest.handler.beanName}")
    private String apiRequestHandlerBeanName;
    @Value("${dps.apiRequest.handler.method}")
    private String apiRequestHandlerMethod;
    @Value("${dps.config.forward}")
    private String configForwardPath;

    @Value("${dps.periodicTask.thread.count}")
    private int periodicTaskThreadCount;

    @Value("${dps.asyncRequestTask.thread.core.count}")
    private int asyncRequestTaskThreadCoreCount;
    @Value("${dps.asyncRequestTask.thread.max.count}")
    private int asyncRequestTaskThreadMaxCount;
    @Value("${dps.asyncRequestTask.thread.queue.count}")
    private int asyncRequestTaskThreadQueueCount;


    @Autowired
    private GenericApplicationContext appContext;
    private final  Contact contact = new Contact("서울시스템", "http://www.ssc.co.kr", "seoul01@ssc.co.kr");

    @Bean(name = "apiRequestHelper")
    public ApiRequestHelper apiRequestHelper()
            throws Exception {
        ApiRequestHelper apiRequestHelper = new ApiRequestHelper(configBasePath, configSysBasePath, apiXmlFileName, defaultConfigXml);
        logger.debug("ApiRequestHelper loaded..");
        return apiRequestHelper;
    }

    @Bean(name = "apiParameterChecker")
    public ApiParameterChecker apiParameterChecker()
            throws Exception {
        return new ApiParameterChecker(apiRequestHelper());
    }

    @Bean(name = "dpsHandlerInterceptor")
    @ConditionalOnMissingBean
    public HandlerInterceptorAdapter dpsHandlerInterceptor() {
        return new MokaCommonHandlerInterceptor("DPS");
    }

    private List<SecurityContext> securityContexts() {
        List<SecurityReference> securityReferences = Arrays.asList(new SecurityReference("basicAuth", new AuthorizationScope[0]));
        return Arrays.asList(SecurityContext
                .builder()
                .securityReferences(securityReferences)
                .forPaths(PathSelectors.any())
                .build());
    }

    private List<SecurityScheme> securitySchemes() {
        return Arrays.asList(new BasicAuth("basicAuth"));
    }

    @Bean
    public Docket commandApi() {
        ApiInfo commandApiInfo = new ApiInfoBuilder()
                .title("DPS Command API")
                .description("DPS의 관리를 위해 사용되는 api 모음")
                .version("1.0.0")
                //                .termsOfServiceUrl(termsOfServiceUrl)
                .contact(contact)
                .license("Commerce License")
                .licenseUrl("http://joongang.co.kr")
                .build();
        return new Docket(DocumentationType.SWAGGER_2)
                .securitySchemes(securitySchemes())
                .securityContexts(securityContexts())
                .groupName("commandApi")
                .select()
                .apis(RequestHandlerSelectors.basePackage("jmnet.moka.core.dps"))
                .paths(PathSelectors.ant("/command/**"))
                .build()
                .apiInfo(commandApiInfo);
    }

    @Bean
    public Docket dataApi() {
        ApiInfo dataApiInfo = new ApiInfoBuilder()
                .title("DPS Data API")
                .description("DPS의 데이터를 처리하기 위한 api 모음")
                .version("1.0.0")
                //                .termsOfServiceUrl(termsOfServiceUrl)
                .contact(contact)
                .license("Commerce License")
                .licenseUrl("http://joongang.co.kr")
                .build();
        return new Docket(DocumentationType.SWAGGER_2)
                .securitySchemes(securitySchemes())
                .securityContexts(securityContexts())
                .groupName("dataApi")
                .select()
                .apis(RequestHandlerSelectors.basePackage("jmnet.moka.core.dps"))
                .paths(new Predicate<String>() {
                    @Override
                    public boolean apply(String input) {
                        return !input.startsWith("/command/") && !input.equals("/"); // /command/로 시작하지 않으면..
                    }
                })
                .build()
                .apiInfo(dataApiInfo);
    }

    @Bean
    public ForwardHandler forwardHandler()
            throws ParserConfigurationException, XPathExpressionException, IOException {
        return new ForwardHandler(this.configForwardPath);
    }


    @Bean(name = "apiRequestHandlerMapping")
    public HandlerMapping apiRequestHandlerMapping(@Autowired ForwardHandler forwardHandler)
            throws ClassNotFoundException, NoSuchMethodException {
        ApiRequestHandlerMapping handlerMapping =
                new ApiRequestHandlerMapping(appContext, apiRequestHandlerClass, apiRequestHandlerBeanName, apiRequestHandlerMethod, forwardHandler);
        handlerMapping.setInterceptors(dpsHandlerInterceptor());

        //RequestMappingHandlerMapping의 Order는 0이므로 이보다 먼저 수행
        handlerMapping.setOrder(-1);
        return handlerMapping;
    }

    @Bean(name = "periodicTaskScheduler")
    public ThreadPoolTaskScheduler periodicScheduler() {
        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
        threadPoolTaskScheduler.setPoolSize(periodicTaskThreadCount);
        threadPoolTaskScheduler.setThreadNamePrefix("periodicTaskScheduler");
        return threadPoolTaskScheduler;
    }

    @Bean(name = "periodicTaskManager")
    @DependsOn(value = {"apiParameterChecker", "apiRequestHelper"})
    public ApiPeriodicTaskManager periodicTaskManager()
            throws Exception {
        ApiPeriodicTaskManager periodicTaskManager = new ApiPeriodicTaskManager(appContext, periodicScheduler(), apiRequestHelper());
        return periodicTaskManager;
    }

    @Bean(name = "apiPeriodicTask")
    @Scope(value = "prototype")
    @DependsOn(value = {"apiParameterChecker", "apiRequestHelper"})
    public ApiPeriodicTask apiPeriodicTask(Api api)
            throws ParameterException {
        return new ApiPeriodicTask(appContext, api);
    }

    @Bean(name = "asyncRequestExecutor")
    public ThreadPoolTaskExecutor asyncRequestExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(asyncRequestTaskThreadCoreCount);
        executor.setMaxPoolSize(asyncRequestTaskThreadMaxCount);
        executor.setQueueCapacity(asyncRequestTaskThreadQueueCount);
        executor.setWaitForTasksToCompleteOnShutdown(false);
        return executor;
    }

    @Bean(name = "asyncRequestTaskManager")
    public AsyncRequestTaskManager asyncRequestTaskManager() {
        return new AsyncRequestTaskManager(asyncRequestExecutor());
    }
}
