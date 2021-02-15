package jmnet.moka.web.push.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.session.SessionManagementFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Bean
    public IpAuthenticationFilter ipAuthenticationFilter()
            throws Exception {
        return new IpAuthenticationFilter(this.authenticationManager());
    }


    @Override
    public void configure(WebSecurity web) {
        web
                .ignoring()
                .antMatchers("/assets/**", "/html/**", "/static/**", "/webjars/**", "/favicon.ico", "/*.js", "/*.map", "/*.png", "/css/**",
                        "/*.json");
    }

    @Override
    public void configure(HttpSecurity http)
            throws Exception {
        http.addFilterBefore(ipAuthenticationFilter(), SessionManagementFilter.class);
        http
                .csrf()
                .disable()
                .authorizeRequests()
                .antMatchers("/", "/swagger-ui.html", "/swagger-resources/**", "/v2/api-docs")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .logout()
                .permitAll();
    }


}
