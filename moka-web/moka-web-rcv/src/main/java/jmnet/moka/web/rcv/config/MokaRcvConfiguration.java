package jmnet.moka.web.rcv.config;

import com.zaxxer.hikari.HikariDataSource;
import java.sql.SQLException;
import javax.sql.DataSource;
import jmnet.moka.web.rcv.task.base.TaskManager;
import lombok.Getter;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.util.StringUtils;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.conf
 * ClassName : MokaRcvConfiguration
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 1:40
 */

@Configuration
@Getter
@MapperScan(basePackages = "jmnet.moka.web.rcv.**.mapper")
@PropertySource("classpath:application.properties")
@AutoConfigureBefore(DataSourceAutoConfiguration.class)
public class MokaRcvConfiguration {
    @Value("${rcv.taskmanager.envfile}")
    private String taskManagerEnvFile;
    @Value("${rcv.imageResizerSvrUrl}")
    private String imageResizerSvrUrl;
    @Value("${rcv.ImageWebSvrUrl}")
    private String ImageWebSvrUrl;
    @Value("${rcv.tempDir}")
    private String tempDir;
    @Value("${rcv.taskmanager.smsListEnvFile}")
    private String smsListEnvFile;
    @Value("${rcv.stagePdsUse}")
    private String stagePds;
    @Value("${rcv.uploadToServiceImage}")
    private String uploadToServiceImage;

    @Value("${rcv.jamapiurl.jai}")
    private String jamApiUrlJai;
    @Value("${rcv.jamapiurl.ilg}")
    private String jamApiUrlIlg;

    @Bean
    @ConfigurationProperties(prefix = "rcv.pds.ftp")
    public FtpConfig getPdsFtpConfig() { return new FtpConfig(); }

//    @Bean
//    @ConfigurationProperties(prefix = "rcv.pdsback.ftp")
//    public FtpConfig getPdsBackFtpConfig() { return new FtpConfig(); }

    @Primary
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean
    public DataSource rcvDataSource() {
        DataSourceProperties dataSourceProperties = dataSourceProperties();
        HikariDataSource dataSource = dataSourceProperties
                .initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
        if (StringUtils.hasText(dataSourceProperties.getName())) {
            dataSource.setPoolName(dataSourceProperties.getName());
        }
        try {
            dataSource
                    .getConnection()
                    .close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return dataSource;
    }

    @Bean
    TaskManager taskManager() {
        return new TaskManager(this);
    }

    @Bean
    public PlatformTransactionManager rcvMybatisTransactionManager() {
        return new DataSourceTransactionManager(this.rcvDataSource());
    }
}
