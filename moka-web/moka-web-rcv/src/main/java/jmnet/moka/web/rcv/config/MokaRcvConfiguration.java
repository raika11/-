package jmnet.moka.web.rcv.config;

import jmnet.moka.web.rcv.task.base.TaskManager;
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
//@MapperScan(basePackages = "jmnet.moka.web.rcv.**.mapper")
@PropertySource("classpath:application.properties")
@AutoConfigureBefore(MokaMybatisConfiguration.class)
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

    @Bean
    TaskManager taskManager() {
        return new TaskManager(this);
    }
}
