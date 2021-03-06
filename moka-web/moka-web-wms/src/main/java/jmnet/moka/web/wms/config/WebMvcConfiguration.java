package jmnet.moka.web.wms.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import javax.persistence.EntityManager;
import jmnet.moka.common.data.support.DTOModelMapper;
import jmnet.moka.common.data.support.SearchParamResolver;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.mvc.interceptor.MokaCommonHandlerInterceptor;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Web MVC Configuration
 *
 * @author ince
 */
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Value("${corsAllowedOrigin}")
    private String corsAllowedOrigin;

    @Value("${react.extra.routePath}")
    private String[] extraRoutePath;

    @Autowired
    private ApplicationContext appContext;

    @Autowired
    private MenuService menuService;


    @Bean
    @ConditionalOnMissingBean
    public ModelMapper wmsModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper
                .getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper;
    }

    /**
     * <pre>
     * LocaleResolver ??????
     * </pre>
     *
     * @return localeResolver
     */
    @Bean
    public LocaleResolver wmsLocaleResolver() {
        return new AcceptHeaderLocaleResolver();
    }


    /**
     * <pre>
     * http request ?????? ????????? ?????? ???????????? ???????????? bean ??????
     * </pre>
     *
     * @return messageByLocale
     */
    @Bean
    public MessageByLocale messageByLocale(@Autowired @Qualifier("wmsMessageSource") MessageSource messageSource,
            @Autowired @Qualifier("wmsLocaleResolver") LocaleResolver localeResolver) {
        return new MessageByLocale(messageSource, localeResolver);
    }

    /**
     * <pre>
     * GeneralHandlerInterceptor ??????
     * </pre>
     *
     * @return GeneralHandlerInterceptor
     */

    @Bean
    public HandlerInterceptorAdapter wmsHandlerInterceptor() {
        return new MokaCommonHandlerInterceptor("WMS");
    }

    /**
     * <pre>
     * ?????? Interceptor ??????
     * </pre>
     *
     * @param registry ???????????????????????????
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry)
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // final LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        // localeChangeInterceptor.setParamName("language");
        // registry.addInterceptor(localeChangeInterceptor);
        registry
                .addInterceptor(wmsHandlerInterceptor())
                .excludePathPatterns("/assets/**")
                // .excludePathPatterns("/html/**")
                .excludePathPatterns("/webjars/**");
    }

    /**
     * <pre>
     * ?????? ????????? ?????? ??????
     * </pre>
     *
     * @param registry ????????????????????????
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurer#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("/assets/**")
                .addResourceLocations("/assets/")
                .resourceChain(false)
                .addResolver(new PathResourceResolver());
    }


    private final ApplicationContext applicationContext;
    private final EntityManager tpsEntityManager;

    @Autowired
    public WebMvcConfiguration(ApplicationContext applicationContext, @Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.applicationContext = applicationContext;
        this.tpsEntityManager = entityManager;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
                .json()
                .applicationContext(this.appContext)
                .build();
        ResourceMapper.setMspDefaultConfiguration(objectMapper);
        argumentResolvers.add(new DTOModelMapper(objectMapper, tpsEntityManager));
        argumentResolvers.add(new SearchParamResolver());
    }

    /**
     * <pre>
     * Chrome ??????????????? ????????? ????????? ?????? ???????????????, minify??? js??? css??? ????????? ????????? ???????????? ????????????
     * http://mvpjava.com/spring-boot-security-httpfirewall
     * </pre>
     *
     * @return
     */
    @Bean
    public HttpFirewall looseHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowedHttpMethods(Arrays.asList("GET", "POST", "OPTIONS", "PUT", "DELETE"));
        firewall.setAllowSemicolon(true);
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowBackSlash(true);
        firewall.setAllowUrlEncodedPercent(true);
        firewall.setAllowUrlEncodedPeriod(true);
        return firewall;
    }

    @Bean
    public HandlerMapping reactRoute()
            throws NoSuchMethodException, SecurityException {
        Set<String> routePaths = menuService.findAllMenuUrl();
        routePaths.addAll(Arrays.asList(extraRoutePath.clone()));
        ReactRoutesHandlerMapping handlerMapping = new ReactRoutesHandlerMapping(routePaths);
        handlerMapping.setOrder(-1);
        return handlerMapping;
    }



    // /**
    // * <pre>
    // * CORS ??????
    // * </pre>
    // * @param registry
    // * @see
    // org.springframework.web.servlet.config.annotation.WebMvcConfigurer#addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry)
    // */
    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    // registry.addMapping("/**")
    // .allowedOrigins(corsAllowedOrigin)
    //// .allowedMethods(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.OPTIONS.name())
    //// .allowCredentials(true)
    //// .maxAge(3600);
    // ;
    // }

}
