package jmnet.moka.web.schedule.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import javax.persistence.EntityManager;
import jmnet.moka.common.data.support.DTOModelMapper;
import jmnet.moka.common.data.support.SearchParamResolver;
import jmnet.moka.core.common.util.ResourceMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration extends WebMvcAutoConfiguration implements WebMvcConfigurer {

    @Autowired
    private ApplicationContext appContext;

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    private final ApplicationContext applicationContext;
    private final EntityManager entityManager;

    @Autowired
    public WebMvcConfiguration(EntityManager entityManager, ApplicationContext applicationContext) {
        this.entityManager = entityManager;
        this.applicationContext = applicationContext;
    }


    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
                .json()
                .applicationContext(this.appContext)
                .build();
        ResourceMapper.setMspDefaultConfiguration(objectMapper);
        argumentResolvers.add(new DTOModelMapper(objectMapper, entityManager));
        argumentResolvers.add(new SearchParamResolver());
    }
}
