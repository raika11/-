package jmnet.moka.web.schedule;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import jmnet.moka.web.schedule.config.PropertyHolder;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.AbstractEnvironment;


@SpringBootApplication
@MapperScan(basePackages = "jmnet.moka.web.schedule.mvc.**.mapper")
@EnableEncryptableProperties
public class MokaScheduleApplication {

    public static void main(String[] args) {
        String SPRING_PROFILES_ACTIVE = System.getProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "");
        System.setProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, SPRING_PROFILES_ACTIVE);

        SpringApplication application = new SpringApplication(MokaScheduleApplication.class);

        application.run(args);
    }

    /**
     * <pre>
     * PropertyHolder 클래스 Bean 객체 처리
     * </pre>
     *
     * @return PropertyHolder
     */
    @Bean
    public PropertyHolder propertiesHolder() {
        return new PropertyHolder();
    }
}
