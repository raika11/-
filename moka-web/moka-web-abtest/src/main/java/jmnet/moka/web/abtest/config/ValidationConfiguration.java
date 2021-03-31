package jmnet.moka.web.abtest.config;

import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

/**
 * Validation Configuration
 *
 * @author kspark
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ValidationConfiguration implements BeanNameAware {

    private static final String VALIDATOR_BEAN = "abtestValidator";

    @Value("${messageSources.baseNames}")
    private String[] messageBaseNames;

    @Autowired
    private ApplicationContext appContext;

    private MethodValidationPostProcessor methodValidationPostProcessor;

    /**
     * <pre>
     * MessageSource 설정
     * </pre>
     *
     * @return messageSource
     */
    @Bean
    public MessageSource abtestMessageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(messageBaseNames);
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(10);
        return messageSource;
    }

    /**
     * <pre>
     * LocalValidatorFactoryBean Bean 객체 생성
     * </pre>
     *
     * @return
     */
    @Bean(VALIDATOR_BEAN)
    public LocalValidatorFactoryBean getValidator(@Autowired @Qualifier("abtestMessageSource") MessageSource messageSource) {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource);
        return bean;
    }

    /**
     * <pre>
     * MethodValidationPostProcessor Bean 객체 생성
     * </pre>
     *
     * @return
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE + 10)
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        this.methodValidationPostProcessor = new MethodValidationPostProcessor();
        // auto-proxying에서 제외되지 않도록 validator를 나중에 설정한다.
        // processor.setValidator(validator);
        return this.methodValidationPostProcessor;
    }

    @Override
    public void setBeanName(String name) {
        if (name.equals(VALIDATOR_BEAN)) {
            LocalValidatorFactoryBean validatorBean = this.appContext.getBean(VALIDATOR_BEAN, LocalValidatorFactoryBean.class);
            this.methodValidationPostProcessor.setValidator(validatorBean);
        }
    }

}
