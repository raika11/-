package jmnet.moka.core.comment.config; /**
 * msp-comment WebMvcConfiguration.java 2019. 11. 29. 오후 2:05:07 ssc
 */

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
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
@AutoConfigureBefore(DataSourceAutoConfiguration.class)
@Import({CommentJpaConfiguration.class, CommentQuerydslConfiguration.class, CommentMybatisConfiguration.class})
@ComponentScan(basePackages = {"jmnet.moka.core.comment.mvc"})
public class CommentConfiguration {

    @Qualifier
    @Bean
    @ConfigurationProperties(prefix = "comment.spring.datasource")
    public DataSourceProperties commentDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Qualifier
    @Bean
    public DataSource commentDataSource() {
        DataSourceProperties dataSourceProperties = commentDataSourceProperties();
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
