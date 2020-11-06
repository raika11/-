package jmnet.moka.web.rcv.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.config
 * ClassName : FtpConfig
 * Created : 2020-11-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-04 004 오후 5:50
 */

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "ftp")
public class FtpConfig {
    private String ip;
    private String user;
    private String password;
    private String rootDir;
    private int passive;
    private int port;
}
