package jmnet.moka.core.tms.autoConfig;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.proxy.http.ApiHttpProxyFactory;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.core.common.mvc.interceptor.MokaCommonHandlerInterceptor;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.mvc.CdnRedirector;
import jmnet.moka.core.tms.mvc.DefaultMergeHandlerMapping;
import jmnet.moka.core.tms.mvc.DefaultMergeViewResolver;
import jmnet.moka.core.tms.mvc.HandlerAndView;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.DpsDomainResolver;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import jmnet.moka.core.tms.template.loader.DpsTemplateLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.mobile.device.LiteDeviceResolver;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;
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
@EnableSwagger2
@EnableAspectJAutoProxy
@PropertySource("classpath:tms-auto.properties")
@ComponentScan(basePackages = {"jmnet.moka.core.tms.mvc"})
public class TmsAutoConfiguration {

    public static final Logger logger = LoggerFactory.getLogger(TmsAutoConfiguration.class);
    public static final long ITEM_EXPIRE_TIME = 10 * 1000;
    public static final long RESERVED_EXPIRE_TIME = 10 * 1000;

    @Value("${tms.merge.handlerAndView.list}")
    private String[] handlerAndViewArray;

    @Value("${tms.interceptor.enable}")
    private boolean tmsInterceptorEnable;

    @Value("${tms.item.api.host}")
    private String itemApiHost;

    @Value("${tms.item.api.path}")
    private String itemApiPath;

    @Value("${tms.default.api.host}")
    private String defaultApiHost;

    @Value("${tms.default.api.path}")
    private String defaultApiPath;

    @Value("${tms.default.api.hostPath.use}")
    private boolean defaultApiHostUse;

    @Value("${tms.item.expire.time}")
    protected String itemExpireTimeStr;

    @Value("${tms.reserved.expire.time}")
    protected String reservedExpireTimeStr;

    @Value("${tms.template.loader.cache}")
    private boolean templateLoaderCache;

    private GenericApplicationContext appContext;

    private ApiHttpProxyFactory apiHttpProxyFactory;

    @Autowired
    public TmsAutoConfiguration(GenericApplicationContext appContext, ApiHttpProxyFactory apiHttpProxyFactory) {
        this.appContext = appContext;
        this.apiHttpProxyFactory = apiHttpProxyFactory;
    }

    /**
     * <pre>
     * HttpProxy로 DPS에서 데이터를 로딩하는 HttpProxyLoader Bean을 생성한다.
     * </pre>
     *
     * @param apiHost apiHost
     * @param apiPath apiPath
     * @return HttpProxyLoader Bean
     */
    @Bean
    @Scope("prototype")
    @ConditionalOnMissingBean
    public HttpProxyDataLoader httpProxyDataLoader(String apiHost, String apiPath) {
        HttpProxy httpProxy = this.apiHttpProxyFactory.getApiHttpProxy(apiHost, apiPath);
        return new HttpProxyDataLoader(httpProxy);
    }

    /**
     * <pre>
     * 머지를 위한 http요청 파라미터d의 특수하게 처리해야할 파라미터를 처리한다
     * </pre>
     *
     * @return HttpParamFactory bean
     */
    @Bean
    public HttpParamFactory httpParamFactory() {
        return new HttpParamFactory();
    }

    /**
     * <pre>
     * 도메인 정보를 조회하는 DomainResolver Bean을 생성한다.
     * </pre>
     *
     * @return DomainResolver Bean
     */
    @Bean(name = "domainResolver")
    @ConditionalOnMissingBean
    public DomainResolver domainResolver() {
        DomainResolver domainResolver;
        long reservedExpireTime = TimeHumanizer.parseLong(this.reservedExpireTimeStr, ITEM_EXPIRE_TIME);
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
        domainResolver = new DpsDomainResolver(httpProxyDataLoader, reservedExpireTime);
        return domainResolver;
    }

    /**
     * <pre>
     * CDN으로 트래픽분산된 기사를 redirect하기 위한 Bean을 생성한다.
     * </pre>
     *
     * @return CdnRedirector Bean
     */
    @Bean(name = "CdnRedirector")
    public CdnRedirector cdnRedirector() {
        HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
        CdnRedirector cdnRedirector = new CdnRedirector( this.appContext, httpProxyDataLoader);
        return cdnRedirector;
    }

    /**
     * <pre>
     * 도메인 별 템플릿(아이템) 로더 Bean을 생성한다.
     * File 기반(FileTemplateLoader)과 DPS기반(DpsTemplateLoader)의 로더가 있다.
     * </pre>
     *
     * @param domainId 도메인 id
     * @return 템플릿 로더
     */
    @Bean(name = "templateLoader")
    @Scope("prototype")
    @ConditionalOnMissingBean
    public AbstractTemplateLoader templateLoader(String domainId) {
        CacheManager cacheManager = (CacheManager)appContext.getBean("cacheManager");
        AbstractTemplateLoader templateLoader = null;
        try {
            HttpProxyDataLoader httpProxyDataLoader = appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
            long itemExpireTime = TimeHumanizer.parseLong(this.itemExpireTimeStr, ITEM_EXPIRE_TIME);
            templateLoader = new DpsTemplateLoader(appContext, domainId, httpProxyDataLoader, cacheManager, templateLoaderCache, false, itemExpireTime);
        } catch (Exception e) {
            logger.warn("TemplateLoader Creation failed: {}", e.getMessage());
        }
        return templateLoader;
    }

    /**
     * <pre>
     * 도메인 전체에 대한 머지를 담당하는 DomainTemplateMerger를 생성한다.
     * </pre>
     *
     * @return 도메인 템플릿 머저
     */
    @Bean(name = "domainTemplateMerger")
    @ConditionalOnMissingBean(name = "domainTemplateMerger")
    public MokaDomainTemplateMerger domainTemplateMerger()
            throws TemplateMergeException, TemplateParseException {
        return new MokaDomainTemplateMerger(appContext, defaultApiHost, defaultApiPath, defaultApiHostUse);
    }

    @Bean(name = "mergeHandlerMapping")
    @ConditionalOnMissingBean(name = "mergeHandlerMapping")
    public AbstractHandlerMapping mergeHandlerMapping(@Autowired List<HandlerAndView> handlerAndViewList, @Autowired DomainResolver domainResolver,
            @Autowired(required = false) HandlerInterceptorAdapter tmsHandlerInterceptor)
            throws ClassNotFoundException {
        try {
            AbstractHandlerMapping handlerMapping = new DefaultMergeHandlerMapping(appContext, domainResolver, handlerAndViewList);
            if (tmsHandlerInterceptor != null && this.tmsInterceptorEnable) {
                handlerMapping.setInterceptors(tmsHandlerInterceptor);
            }
            handlerMapping.setOrder(-1);

            return handlerMapping;
        } catch (Exception e) {
            logger.error("Merge HandlerMapping Creation Faild!", e);
            throw e;
        }
    }

    @Bean(name = "handlerAndViewList")
    public List<HandlerAndView> handlerAndViewList() {
        List<HandlerAndView> handlerAndViewList = new ArrayList<>();
        for (String handlerAndView : this.handlerAndViewArray) {
            handlerAndViewList.add(new HandlerAndView(appContext, handlerAndView));
        }
        return handlerAndViewList;
    }

    /**
     * <pre>
     * 머지 요청에 대한 ViewResolver를 생성한다.
     * </pre>
     *
     * @return 뷰 리졸버
     * @throws ClassNotFoundException 클래스 예외
     */
    @Bean(name = "mergeViewResolver")
    @ConditionalOnMissingBean(name = "mergeViewResolver")
    public ViewResolver mergeViewResolver(@Autowired List<HandlerAndView> handlerAndViewList)
            throws ClassNotFoundException {
        final DefaultMergeViewResolver resolver = new DefaultMergeViewResolver(0);
        for (HandlerAndView handlerAndView : handlerAndViewList) {
            appContext.registerBean(handlerAndView.getViewName(), Class.forName(handlerAndView.getViewClass()),
                    (beanDefinition) -> beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON));
            View view = (View) appContext.getBean(handlerAndView.getViewName());
            resolver.addView(handlerAndView.getViewName(), view);
        }
        return resolver;
    }

    @Bean(name = "tmsHandlerInterceptor")
    @ConditionalOnMissingBean(name = "tmsHandlerInterceptor")
    public HandlerInterceptorAdapter tmsHandlerInterceptor() {
        return new MokaCommonHandlerInterceptor("TMS");
    }

    /**
     * 접속 디바이스 유형을 탐지하기 위한 Bean
     * @return LiteDeviceResolver
     */
    @Bean(name = "deviceResolver")
    public LiteDeviceResolver deviceResolver() {
        return new LiteDeviceResolver();
    }

    private Contact contact = new Contact("중앙일보 Moka TMS", "http://joongang.co.kr", "mater@joongang.co.kr");

    @Bean
    public Docket tmsApi() {
        ApiInfo commandApiInfo = new ApiInfoBuilder()
                .title("TMS Command API")
                .description("TMS의 관리를 위해 사용되는 api 모음")
                .version("1.0.0")
                //                .termsOfServiceUrl(termsOfServiceUrl)
                .contact(contact)
                .license("Commerce License")
                .licenseUrl("http://www.ssc.co.kr")
                .build();
        return new Docket(DocumentationType.SWAGGER_2)
                .securitySchemes(securitySchemes())
                .securityContexts(securityContexts())
                .groupName("commandApi")
                .select()
                .apis(RequestHandlerSelectors.basePackage("jmnet.moka.core.tms"))
                .paths(PathSelectors.ant("/command/*"))
                .build()
                .apiInfo(commandApiInfo);
    }

    private List<SecurityContext> securityContexts() {
        List<SecurityReference> securityReferences = Collections.singletonList(new SecurityReference("basicAuth", new AuthorizationScope[0]));
        return Collections.singletonList(SecurityContext
                .builder()
                .securityReferences(securityReferences)
                .forPaths(PathSelectors.any())
                .build());
    }

    private List<SecurityScheme> securitySchemes() {
        return Collections.singletonList(new BasicAuth("basicAuth"));
    }

}
