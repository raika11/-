/**
 * msp-tps TpsSecurityConfiguration.java 2020. 1. 3. 오후 3:28:13 ssc
 */
package jmnet.moka.web.wms.config.security;

import com.hazelcast.core.HazelcastInstance;
import java.io.IOException;
import java.util.Arrays;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.web.wms.config.ReactRoutesHandlerMapping;
import jmnet.moka.web.wms.config.hazelcast.HazelcastSessionRegistry;
import jmnet.moka.web.wms.config.infinispan.InfinispanSessionRegistry;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtAuthenticationFilter;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtAuthorizationFilter;
import jmnet.moka.web.wms.config.security.jwt.WmsJwtHelper;
import org.infinispan.spring.embedded.provider.SpringEmbeddedCacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.SessionManagementFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * <pre>
 *
 * 2020. 1. 3. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 3. 오후 3:28:13
 */
@Configuration
@EnableWebSecurity
@DependsOn(value = {"reactRoute"})
//@Import(HazelcastHttpSessionConfiguration.class)
//@Import(WmsInfinispanHttpSessionConfiguration.class)
public class WmsSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Value("${corsAllowedOrigin}")
    private String[] corsAllowedOrigin;

    @Value("${wms.session.registry.type}")
    private String sessionRegistryType;

    @Value("${tps.upload.path.url}")
    private String urlPathPrefix;

    @Autowired
    private ReactRoutesHandlerMapping reactRoute;

    private HttpSecurity httpSecurity;


    /**
     * Spring Security 필터 걸리지 않는 패턴 설정 아래에 있는 antMatchers 필터 처리보다 우선적으로 적용된다.
     */
    @Override
    public void configure(WebSecurity web)
            throws Exception {
        web
                .ignoring()
                .antMatchers("/assets/**", "/html/**", "/static/**", "/webjars/**", "/favicon.ico", "/*.js", "/*.map", "/*.png", "/css/**",
                        "/*.json");
    }

    @Bean
    public WmsJwtAuthenticationFilter jwtAuthenticationFilter()
            throws Exception {
        WmsJwtAuthenticationFilter filter = new WmsJwtAuthenticationFilter(this.authenticationManager());
        SessionRegistry sessionRegistry = sessionRegistry(); //memory/hazelcast/infinispan 기반
        filter.setSessionAuthenticationStrategy(new WmsSessionAuthenticationStrategy(sessionRegistry, 200)); // maxium 동시 사용자 설정
        return filter;
    }

    @Bean
    public WmsJwtAuthorizationFilter jwtAuthorizationFilter()
            throws Exception {
        return new WmsJwtAuthorizationFilter(this.authenticationManager());
    }

    @Bean
    public WmsLogoutHandler wmsLogoutHandler()
            throws Exception {
        return new WmsLogoutHandler();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http)
            throws Exception {
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(jwtAuthorizationFilter(), SessionManagementFilter.class);
        http
                .csrf()
                .disable()    // Cross-Site Request Forgery 공격 방지
                .cors()
                .and()
                .sessionManagement()
                .sessionFixation()
                .none()
                .sessionCreationPolicy(SessionCreationPolicy.NEVER);  // jwtAuthenticationFilter를 통해서만 세션 생성
        http
                .logout()
                .addLogoutHandler(wmsLogoutHandler())
                .logoutUrl(TpsConstants.LOGOUT_PAGE);

        String[] reactRoutes = reactRoute
                .getReactRoutesList()
                .stream()
                .filter(s -> McpString.isNotEmpty(s))
                .map(s -> s + "/**")
                .toArray(value -> new String[value]);

        http.authorizeRequests()
            // home, react 소스, 미리보기, 템플릿 이미지 허용
            .antMatchers("/", TpsConstants.HEALTH_PAGE, "/preview/**", "/image/template/**", "/" + urlPathPrefix + "/**", "/swagger-ui.html",
                    "/swagger-resources/**", "/v2/api-docs", "/api/user/test-login", "/api/group-ware/**")
            .permitAll()
            // react 서버렌더링 허용
            .antMatchers(reactRoutes)
            .permitAll()
            .anyRequest()
            .permitAll()
            .anyRequest()
            .authenticated();
    }

    @Bean
    public HttpSecurity httpSecurity()
            throws Exception {
        return super.getHttp();
    }

    /**
     * <pre>
     * SessionRegistry 설정
     * </pre>
     *
     * @return sessionRegistry
     */
    @Bean
    public SessionRegistry sessionRegistry()
            throws IOException {
        if (this.sessionRegistryType.equals("hazelcast")) {
            HazelcastInstance hzInstance = this
                    .getApplicationContext()
                    .getBean(HazelcastInstance.class);
            return new HazelcastSessionRegistry(hzInstance);
        } else if (this.sessionRegistryType.equals("infinispan")) {
            SpringEmbeddedCacheManager cacheManager = this
                    .getApplicationContext()
                    .getBean(SpringEmbeddedCacheManager.class);
            return new InfinispanSessionRegistry(cacheManager);
        }
        return new SessionRegistryImpl();
    }

    /**
     * <pre>
     * AuthenticationProvider 설정
     * </pre>
     *
     * @return userAuthenticationProvider
     */
    @Bean
    public WmsAuthenticationProvider authenticationProvider() {
        return new WmsAuthenticationProvider();
    }

    /**
     * <pre>
     * httpSessionEventPublisher 설정
     * </pre>
     *
     * @return httpSessionEventPublisher
     * @throws IOException IO예외
     */
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher()
            throws IOException {
        return new HttpSessionEventPublisher(sessionRegistry());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Arrays.asList(corsAllowedOrigin));
        configuration.addAllowedHeader("*");
        // configuration.setAllowedMethods(Arrays.asList("GET","POST","OPTIONS","PUT","DELETE"));
        configuration.addAllowedMethod("*");
        configuration.setExposedHeaders(Arrays.asList(WmsJwtHelper.HEADER_STRING, TpsConstants.HEADER_MENU_ID));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        configuration.addExposedHeader(MokaConstants.HEADER_DOWNLOAD_FILENAME);
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

}
