package jmnet.moka.web.bulk.config;

import jmnet.moka.web.bulk.aspect.IpAllowAspect;
import jmnet.moka.web.bulk.task.base.TaskManager;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.conf
 * ClassName : MokaBulkConfiguration
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 1:40
 */

@Configuration
@Getter
//@MapperScan(basePackages = "jmnet.moka.web.bulk.**.mapper")
@PropertySource("classpath:application.properties")
@AutoConfigureBefore(MokaMybatisConfiguration.class)
public class MokaBulkConfiguration {
    @Value("${bulk.taskmanager.envfile}")
    private String taskManagerEnvFile;
    @Value("${bulk.tempDir}")
    private String tempDir;
    @Value("${bulk.taskmanager.smsListEnvFile}")
    private String smsListEnvFile;

    @Bean
    @ConfigurationProperties(prefix = "bulk.brightcove")
    public BrightCoveConfig getBrightCoveConfig() { return new BrightCoveConfig(); }

    @Bean
    TaskManager taskManager() {
        return new TaskManager(this);
    }

    @Value("${bulk.taskmanager.allow.ips}")
    private String commandAllowIps;

    @Bean
    public IpAllowAspect ipAllowAspect() {
        return new IpAllowAspect(commandAllowIps);
    }
}
