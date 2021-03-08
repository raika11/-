package jmnet.moka.core.mail.config; /**
 * msp-mail WebMvcConfiguration.java 2019. 11. 29. 오후 2:05:07 ssc
 */

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;

import jmnet.moka.core.common.logger.ActionLoggerConfiguration;
import lombok.Data;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.util.StringUtils;

/**
 * <pre>
 *
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2019. 11. 29. 오후 2:05:07
 */
@Configuration
@AutoConfigureAfter({ActionLoggerConfiguration.class,StmpMailConfiguration.class})
@AutoConfigureBefore({DataSourceAutoConfiguration.class})
@Import({MailJpaConfiguration.class, MailQuerydslConfiguration.class})
@ComponentScan(basePackages = {"jmnet.moka.core.mail.mvc", "jmnet.moka.core.mail.common.logger"})
@Data
public class MailConfiguration {

    @Qualifier
    @Bean
    @ConfigurationProperties(prefix = "mail.spring.datasource")
    public DataSourceProperties mailDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Qualifier
    @Bean
    public DataSource mailDataSource() {
        DataSourceProperties dataSourceProperties = mailDataSourceProperties();
        HikariDataSource dataSource = (HikariDataSource) dataSourceProperties
                .initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
        if (StringUtils.hasText(dataSourceProperties.getName())) {
            dataSource.setPoolName(dataSourceProperties.getName());
        }
        return dataSource;
    }
}
