package jmnet.moka.core.common.ftp;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.common.ftp
 * ClassName : MokaFtpConfiguration
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 15:57
 */
@Configuration
@ComponentScan(basePackages = "jmnet.moka.core.common.ftp")
public class MokaFtpConfiguration {

    /**
     * <pre>
     * ftpHelper Bean을 생성한다.
     * </pre>
     *
     * @return ftpHelper
     */
    @Bean
    @DependsOn(value = {"mokaEncryptor"})
    @ConditionalOnProperty(name = "moka.ftp-helper.enable", havingValue = "true")
    public FtpHelper ftpHelper() {
        return new FtpHelper();
    }
}
