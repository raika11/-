/**
 * msp-tps WebMvcConfiguration.java 2019. 11. 29. 오후 2:05:07 ssc
 */
package jmnet.moka.core.tps.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
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
@AutoConfigureBefore(DataSourceAutoConfiguration.class)
@Import({HelperConfiguration.class, PreviewConfiguration.class, TpsJpaConfiguration.class, TpsQuerydslConfiguration.class,
         TpsMybatisConfiguration.class, SwaggerConfiguration.class})
@ComponentScan(basePackages = {"jmnet.moka.core.tps.mvc", "jmnet.moka.core.tps.common.logger"})
public class TpsAutoConfiguration {

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "tps.spring.datasource")
    public DataSourceProperties tpsDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean
    public DataSource tpsDataSource() {
        DataSourceProperties dataSourceProperties = tpsDataSourceProperties();
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
