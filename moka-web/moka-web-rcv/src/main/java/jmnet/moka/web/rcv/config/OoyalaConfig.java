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
 * ClassName : OoyalaConfig
 * Created : 2021-01-07 007 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-07 007 오후 5:52
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "ooyala")
public class OoyalaConfig {
    private String account;
    private String clientId;
    private String clientSecret;
    private String accessTokenUrl;
}
