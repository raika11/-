package jmnet.moka.core.tms.autoConfig;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import jmnet.moka.core.common.mvc.interceptor.MokaCommonHandlerInterceptor;
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
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import jmnet.moka.common.TimeHumanizer;
import jmnet.moka.common.proxy.http.ApiHttpProxyFactory;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.mvc.DefaultMergeHandlerMapping;
import jmnet.moka.core.tms.mvc.DefaultMergeViewResolver;
import jmnet.moka.core.tms.mvc.DefaultPathResolver;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.DpsDomainResolver;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import jmnet.moka.core.tms.template.loader.DpsTemplateLoader;
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

    @Value("${tms.merge.article.handler.class}")
    private String articleHandlerClass;

    @Value("${tms.merge.article.handler.beanName}")
    private String articleHandlerBeanName;

    @Value("${tms.merge.article.handler.method}")
    private String articleHandlerMethodName;

    @Value("${tms.merge.article.view.class}")
    private String articleViewClass;

    @Value("${tms.merge.article.view.name}")
    private String articleViewName;

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

    @Value("${tms.item.expire.time}")
    protected String itemExpireTimeStr;

    @Value("${tms.reserved.expire.time}")
    protected String reservedExpireTimeStr;

    @Value("${tms.template.loader.cache}")
    private boolean templateLoaderCache;

    @Value("${tms.default.template.domain}")
    private String defaultTemplateDomain;

    @Autowired
    private GenericApplicationContext appContext;

    @Autowired
    private ApiHttpProxyFactory apiHttpProxyFactory;

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
     * @throws TmsException
     */
    @Bean(name = "domainResolver")
    @ConditionalOnMissingBean
    public DomainResolver domainResolver()
            throws TmsException {
        DomainResolver domainResolver = null;
        long reservedExpireTime =
                TimeHumanizer.parseLong(this.reservedExpireTimeStr, ITEM_EXPIRE_TIME);
        HttpProxyDataLoader httpProxyDataLoader =
                appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
        domainResolver = new DpsDomainResolver(httpProxyDataLoader, reservedExpireTime);
        return domainResolver;
    }

    /**
     * <pre>
     * 요청된 URL의 경로를 처리하는 Bean을 생성한다.
     * </pre>
     * 
     * @return PathResolver Bean
     * @throws IOException IO 예외
     * @throws TemplateLoadException
     * @throws TemplateParseException
     * @throws TmsException
     */
    @Bean(name = "pathResolver")
    @ConditionalOnMissingBean
    public DefaultPathResolver pathResolver()
            throws IOException, TmsException, TemplateParseException, TemplateLoadException {
        return new DefaultPathResolver(domainResolver(), domainTemplateMerger());
    }

    /**
     * 
     * <pre>
     * 도메인 별 템플릿(아이템) 로더 Bean을 생성한다.
     * File 기반(FileTemplateLoader)과 DPS기반(DpsTemplateLoader)의 로더가 있다.
     * </pre>
     * 
     * @param domainId 도메인 id
     * @return
     * @throws TmsException
     */
    @Bean(name = "templateLoader")
    @Scope("prototype")
    @ConditionalOnMissingBean
    public AbstractTemplateLoader templateLoader(String domainId) {
        AbstractTemplateLoader templateLoader = null;
        try {
            HttpProxyDataLoader httpProxyDataLoader =
                    appContext.getBean(HttpProxyDataLoader.class, itemApiHost, itemApiPath);
            long itemExpireTime = TimeHumanizer.parseLong(this.itemExpireTimeStr, ITEM_EXPIRE_TIME);
            templateLoader = new DpsTemplateLoader(domainId, httpProxyDataLoader,
                    templateLoaderCache, itemExpireTime);
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
     * @return
     * @throws TemplateParseException
     * @throws TmsException
     * @throws TemplateLoadException
     */
    @Bean(name = "domainTemplateMerger")
    @ConditionalOnMissingBean(name = "domainTemplateMerger")
    public MokaDomainTemplateMerger domainTemplateMerger()
            throws TemplateParseException {
        MokaDomainTemplateMerger domainTemplateMerger =
                new MokaDomainTemplateMerger(appContext, defaultApiHost, defaultApiPath);
        return domainTemplateMerger;
    }

    @Bean(name = "mergeHandlerMapping")
    @ConditionalOnMissingBean(name = "mergeHandlerMapping")
    public AbstractHandlerMapping mergeHandlerMapping(
            @Autowired(required = false) HandlerInterceptorAdapter tmsHandlerInterceptor) {
        try {
            AbstractHandlerMapping handlerMapping = new DefaultMergeHandlerMapping(appContext,
                    defaultHandlerClass, defaultHandlerBeanName, defaultHandlerMethodName,
                    articleHandlerClass, articleHandlerBeanName, articleHandlerMethodName);
            if (tmsHandlerInterceptor != null && this.tmsInterceptorEnable == true) {
                handlerMapping.setInterceptors(tmsHandlerInterceptor);
            }
            handlerMapping.setOrder(-1);

            return handlerMapping;
        } catch (Exception e) {
            logger.error("Merge HandlerMapping Not Found: {}",
                    defaultHandlerClass + "." + defaultHandlerMethodName, e);
        }
        return null;
    }

    /**
     * <pre>
     * 머지 요청에 대한 ViewResolver를 생성한다.
     * </pre>
     * 
     * @return
     * @throws ClassNotFoundException
     */
    @Bean(name = "mergeViewResolver")
    @ConditionalOnMissingBean(name = "mergeViewResolver")
    public ViewResolver mergeViewResolver() throws ClassNotFoundException {
        // default view
        appContext.registerBean(this.defaultViewName, Class.forName(this.defaultViewClass),
                (beanDefinition) -> {
                    beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
                });
        View defaultView = (View) appContext.getBean(this.defaultViewName);
        // default article view
        appContext.registerBean(this.articleViewName, Class.forName(this.articleViewClass),
                (beanDefinition) -> {
                    beanDefinition.setScope(ConfigurableBeanFactory.SCOPE_SINGLETON);
                });
        View articleView = (View) appContext.getBean(this.articleViewName);

        final DefaultMergeViewResolver resolver = new DefaultMergeViewResolver(this.defaultViewName, defaultView, 0);
        resolver.setArticleView(this.articleViewName, articleView);
        return resolver;
    }

    @Bean(name = "tmsHandlerInterceptor")
    @ConditionalOnMissingBean(name = "tmsHandlerInterceptor")
    public HandlerInterceptorAdapter tmsHandlerInterceptor() {
        return new MokaCommonHandlerInterceptor("TMS");
    }

    private Contact contact = new Contact("서울시스템", "http://joongang.co.kr", "mater@joongang.co.kr");

    @Bean
    public Docket tmsApi() {
        ApiInfo commandApiInfo = new ApiInfoBuilder().title("TMS Command API")
                .description("TMS의 관리를 위해 사용되는 api 모음").version("1.0.0")
                //                .termsOfServiceUrl(termsOfServiceUrl)
                .contact(contact).license("Commerce License").licenseUrl("http://www.ssc.co.kr")
                .build();
        Docket commandApiDocket =
                new Docket(DocumentationType.SWAGGER_2).securitySchemes(securitySchemes())
                        .securityContexts(securityContexts()).groupName("commandApi")
                .select()
                .apis(RequestHandlerSelectors.basePackage("jmnet.moka.core.tms"))
                .paths(PathSelectors.ant("/command/*")).build().apiInfo(commandApiInfo);
        return commandApiDocket;
    }

    private List<SecurityContext> securityContexts() {
        List<SecurityReference> securityReferences =
                Arrays.asList(new SecurityReference("basicAuth", new AuthorizationScope[0]));
        return Arrays.asList(SecurityContext.builder().securityReferences(securityReferences)
                .forPaths(PathSelectors.any()).build());
    }

    private List<SecurityScheme> securitySchemes() {
        return Arrays.asList(new BasicAuth("basicAuth"));
    }

}
