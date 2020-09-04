package jmnet.moka.web.tms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.resource.PathResourceResolver;
import jmnet.moka.core.common.mvc.interceptor.MspCommonHandlerInterceptor;

/**
 * Web MVC Configuration
 * @author ince
 *
 */
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Autowired
    private GenericApplicationContext appContext;

    @Value("${tms.interceptor.enable}")
    private boolean tmsInterceptorEnable;

    /**
     * 
     * <pre>
     * GeneralHandlerInterceptor 생성
     * </pre>
     * 
     * @return GeneralHandlerInterceptor
     */

    @Bean
    public HandlerInterceptorAdapter tmsHandlerInterceptor() {
        return new MspCommonHandlerInterceptor("TMS");
    }

    /**
     * 
     * <pre>
     * 전역 Interceptor 설정
     * </pre>
     * 
     * @param registry 인터셉터레지스트리
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry)
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        final LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        registry.addInterceptor(localeChangeInterceptor);
        HandlerInterceptorAdapter tmsHandlerInterceptor =
                appContext.getBean(HandlerInterceptorAdapter.class, "tmsHandlerInterceptor");
        if (tmsHandlerInterceptor != null && this.tmsInterceptorEnable == true) {
            registry.addInterceptor(tmsHandlerInterceptor()).excludePathPatterns("/assets/**")
                // .excludePathPatterns("/html/**")
                .excludePathPatterns("/webjars/**");
        }
    }

    /**
     * 
     * <pre>
     * 정적 리소스 경로 설정
     * </pre>
     * 
     * @param registry 리소스레지스트리
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurer#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/**").addResourceLocations("/assets/")
                .resourceChain(false).addResolver(new PathResourceResolver());
    }

    /**
     * <pre>
     * CORS 처리
     * </pre>
     * 
     * @param registry
     * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurer#addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry)
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*")
                //         .allowedMethods(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.OPTIONS.name())
                .allowCredentials(true)
        // .maxAge(3600);
        ;
    }

}